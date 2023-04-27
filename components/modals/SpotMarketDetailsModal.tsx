import { ModalProps } from '../../types/modal'
import Modal from '../shared/Modal'
import { useTranslation } from 'next-i18next'
import useSelectedMarket from 'hooks/useSelectedMarket'
import { Serum3Market } from '@blockworks-foundation/mango-v4'
import Button from '@components/shared/Button'
import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import Tooltip from '@components/shared/Tooltip'

interface SpotMarketDetailsModalProps {
  market: Serum3Market | undefined
}

type ModalCombinedProps = SpotMarketDetailsModalProps & ModalProps

const SpotMarketDetailsModal = ({
  isOpen,
  onClose,
  market,
}: ModalCombinedProps) => {
  const { t } = useTranslation(['common', 'trade'])
  const { serumOrPerpMarket } = useSelectedMarket()
  const { group } = useMangoGroup()

  const [baseBank, quoteBank] = useMemo(() => {
    if (!group || !market) return [undefined, undefined]
    const base = group.getFirstBankByTokenIndex(market.baseTokenIndex)
    const quote = group.getFirstBankByTokenIndex(market.quoteTokenIndex)
    return [base, quote]
  }, [group, market])

  const [baseMintInfo, quoteMintInfo] = useMemo(() => {
    if (!baseBank || !quoteBank) return [undefined, undefined]
    const base = group!.mintInfosMapByMint.get(baseBank.mint.toString())
    const quote = group!.mintInfosMapByMint.get(quoteBank.mint.toString())
    return [base, quote]
  }, [baseBank, quoteBank])

  return market && serumOrPerpMarket ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-center text-lg">
        {t('trade:market-details', { market: market.name })}
      </h2>
      <div className="mt-4 space-y-2.5">
        <div className="flex justify-between">
          <p>{t('trade:min-order-size')}</p>
          <p className="font-mono text-th-fgd-2">
            {serumOrPerpMarket.minOrderSize}
          </p>
        </div>
        <div className="flex justify-between">
          <p>{t('trade:tick-size')}</p>
          <p className="font-mono text-th-fgd-2">
            {serumOrPerpMarket.tickSize}
          </p>
        </div>
        <div className="flex justify-between">
          <p>{t('trade:max-leverage')}</p>
          <p className="font-mono text-th-fgd-2">5x</p>
        </div>
        {baseMintInfo ? (
          <div className="flex justify-between">
            <Tooltip
              content={t('trade:tooltip-insured', {
                tokenOrMarket: baseBank!.name,
              })}
            >
              <p className="tooltip-underline">
                {t('trade:insured', { token: baseBank!.name })}
              </p>
            </Tooltip>
            <p className="font-mono text-th-fgd-2">
              {baseMintInfo.groupInsuranceFund ? t('yes') : t('no')}
            </p>
          </div>
        ) : null}
        {quoteMintInfo ? (
          <div className="flex justify-between">
            <Tooltip
              content={t('trade:tooltip-insured', {
                tokenOrMarket: quoteBank!.name,
              })}
            >
              <p className="tooltip-underline">
                {t('trade:insured', { token: quoteBank!.name })}
              </p>
            </Tooltip>
            <p className="font-mono text-th-fgd-2">
              {quoteMintInfo.groupInsuranceFund ? t('yes') : t('no')}
            </p>
          </div>
        ) : null}
      </div>
      <Button className="mt-6 w-full" onClick={onClose}>
        {t('close')}
      </Button>
    </Modal>
  ) : null
}

export default SpotMarketDetailsModal
