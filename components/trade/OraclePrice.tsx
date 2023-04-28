import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import useSelectedMarket from 'hooks/useSelectedMarket'
import Tooltip from '@components/shared/Tooltip'
import { useTranslation } from 'next-i18next'
import mangoStore from '@store/mangoStore'
import { useEffect, useState } from 'react'
import {
  PerpMarket,
  Bank,
  OracleProvider,
} from '@blockworks-foundation/mango-v4'
import { BorshAccountsCoder } from '@coral-xyz/anchor'
import {
  floorToDecimal,
  formatCurrencyValue,
  getDecimalCount,
} from 'utils/numbers'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

const OraclePrice = ({
  setChangePrice,
}: {
  setChangePrice: (price: number) => void
}) => {
  const {
    serumOrPerpMarket,
    price: stalePrice,
    selectedMarket,
    quoteBank,
  } = useSelectedMarket()
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  const connection = mangoStore((s) => s.connection)
  const [price, setPrice] = useState(stalePrice)
  const [oracleProviderName, setOracleProviderName] = useState('Unknown')
  const [oracleLastUpdatedSlot, setOracleLastUpdatedSlot] = useState(0)
  const [highestSlot, setHighestSlot] = useState(0)
  const [isStale, setIsStale] = useState(false)

  const { t } = useTranslation(['common', 'trade'])

  //subscribe to the market oracle account
  useEffect(() => {
    const client = mangoStore.getState().client
    const group = mangoStore.getState().group
    if (!group || !selectedMarket) return

    let marketOrBank: PerpMarket | Bank
    let decimals: number
    if (selectedMarket instanceof PerpMarket) {
      marketOrBank = selectedMarket
      decimals = selectedMarket.baseDecimals
    } else {
      const baseBank = group.getFirstBankByTokenIndex(
        selectedMarket.baseTokenIndex
      )
      marketOrBank = baseBank
      decimals = group.getMintDecimals(baseBank.mint)
    }

    switch (marketOrBank.oracleProvider) {
      case OracleProvider.Pyth:
        setOracleProviderName('Pyth')
        break
      case OracleProvider.Switchboard:
        setOracleProviderName('Switchboard')
        break
      case OracleProvider.Stub:
        setOracleProviderName('Stub')
        break
      default:
        setOracleProviderName('Unknown')
    }

    const coder = new BorshAccountsCoder(client.program.idl)
    const subId = connection.onAccountChange(
      marketOrBank.oracle,
      async (info, context) => {
        // selectedMarket = mangoStore.getState().selectedMarket.current
        // if (!(selectedMarket instanceof PerpMarket)) return
        const { price, uiPrice, lastUpdatedSlot } =
          await group.decodePriceFromOracleAi(
            coder,
            marketOrBank.oracle,
            info,
            decimals,
            client
          )
        marketOrBank._price = price
        marketOrBank._uiPrice = uiPrice
        marketOrBank._oracleLastUpdatedSlot = lastUpdatedSlot
        setOracleLastUpdatedSlot(lastUpdatedSlot)

        const marketSlot = mangoStore.getState().selectedMarket.lastSeenSlot
        const oracleWriteSlot = context.slot
        const accountSlot = mangoStore.getState().mangoAccount.lastSlot
        const highestSlot = Math.max(
          marketSlot.bids,
          marketSlot.asks,
          oracleWriteSlot,
          accountSlot
        )
        const maxStalenessSlots =
          marketOrBank.oracleConfig.maxStalenessSlots.toNumber()
        setHighestSlot(highestSlot)
        setIsStale(
          maxStalenessSlots > 0 &&
            highestSlot - lastUpdatedSlot > maxStalenessSlots
        )

        if (selectedMarket instanceof PerpMarket) {
          setPrice(uiPrice)
          setChangePrice(uiPrice)
        } else {
          let price
          if (quoteBank && serumOrPerpMarket) {
            price = floorToDecimal(
              uiPrice / quoteBank.uiPrice,
              getDecimalCount(serumOrPerpMarket.tickSize)
            ).toNumber()
          } else {
            price = 0
          }
          setPrice(price)
          setChangePrice(price)
        }
      },
      'processed'
    )
    return () => {
      if (typeof subId !== 'undefined') {
        connection.removeAccountChangeListener(subId)
      }
    }
  }, [connection, selectedMarket])

  return (
    <>
      <div id="trade-step-two" className="flex-col whitespace-nowrap md:ml-6">
        <Tooltip
          placement="bottom"
          content={
            <>
              <div>
                {t('trade:price-provided-by')} {oracleProviderName}.
              </div>
              <div className="mt-2">
                {t('trade:last-updated')}{' '}
                {dayjs
                  .duration({
                    seconds: -((highestSlot - oracleLastUpdatedSlot) * 0.5),
                  })
                  .humanize(true)}
                .
              </div>
              {isStale ? (
                <div className="mt-2 font-black">
                  {t('trade:oracle-not-updated')}
                  <br />
                  {t('trade:oracle-not-updated-warning')}
                </div>
              ) : undefined}
            </>
          }
        >
          <div className="flex items-center">
            <div className="text-xs text-th-fgd-4">
              {t('trade:oracle-price')}
            </div>
            {isStale ? (
              <ExclamationTriangleIcon className="ml-1 h-4 w-4 text-th-warning" />
            ) : (
              <InformationCircleIcon className="ml-1 h-4 w-4 text-th-fgd-4" />
            )}
          </div>
        </Tooltip>
        <div className="font-mono text-xs text-th-fgd-2">
          {price ? (
            `${formatCurrencyValue(
              price,
              getDecimalCount(serumOrPerpMarket?.tickSize || 0.01)
            )}`
          ) : (
            <span className="text-th-fgd-4">–</span>
          )}
        </div>
      </div>
    </>
  )
}

export default OraclePrice