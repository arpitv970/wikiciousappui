import TabButtons from '@components/shared/TabButtons'
import { useState } from 'react'
import Orderbook from './Orderbook'
import RecentTrades from './RecentTrades'
import DepthChart from './DepthChart'
import useLocalStorageState from 'hooks/useLocalStorageState'
import { DEPTH_CHART_KEY } from 'utils/constants'

export const TABS: [string, number][] = [
  ['trade:book', 0],
  ['trade:trades', 0],
]

const OrderbookAndTrades = ({
  grouping,
  setGrouping,
}: {
  grouping: number
  setGrouping: (g: number) => void
}) => {
  const [activeTab, setActiveTab] = useState('trade:book')
  const [showDepthChart] = useLocalStorageState<boolean>(DEPTH_CHART_KEY, false)
  return (
    <div className="hide-scroll h-full">
      <div className="border-b border-th-bkg-3">
        <TabButtons
          activeValue={activeTab}
          onChange={(tab: string) => setActiveTab(tab)}
          values={TABS}
          fillWidth
        />
      </div>
      <div
        className={`flex ${activeTab === 'trade:book' ? 'visible' : 'hidden'}`}
      >
        {showDepthChart ? (
          <div className="z-20 w-1/2 border-r border-th-bkg-3">
            <DepthChart grouping={grouping} />
          </div>
        ) : null}
        <div className={showDepthChart ? 'w-1/2' : 'w-full'}>
          <Orderbook grouping={grouping} setGrouping={setGrouping} />
        </div>
      </div>
      <div
        className={`h-full ${
          activeTab === 'trade:trades' ? 'visible' : 'hidden'
        }`}
      >
        <RecentTrades />
      </div>
    </div>
  )
}

export default OrderbookAndTrades
