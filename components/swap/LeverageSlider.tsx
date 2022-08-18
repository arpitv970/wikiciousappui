import { ChangeEvent, useEffect, useRef, useState } from 'react'
import mangoStore from '../../store/state'
import { useTokenMax } from './Swap'

type LeverageSliderProps = {
  amount: number
  inputToken: string
  outputToken: string
  onChange: (x: string) => void
}

const LeverageSlider = ({
  amount,
  leverageMax,
  onChange,
}: {
  amount: number
  leverageMax: number
  onChange: (x: any) => any
}) => {
  const [value, setValue] = useState(0)
  const inputEl = useRef<HTMLInputElement>(null)
  const inputTokenInfo = mangoStore((s) => s.swap.inputTokenInfo)

  useEffect(() => {
    if (inputEl.current) {
      const target = inputEl.current
      const min = parseFloat(target.min)
      const max = leverageMax

      target.style.backgroundSize =
        max - min === 0
          ? '0% 100%'
          : ((value - min) * 100) / (max - min) + '% 100%'
    }
  }, [leverageMax, value])

  useEffect(() => {
    onChange(amount.toString())
    setValue(amount)
  }, [amount])

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    let target = e.target
    const min = parseFloat(target.min)
    const max = parseFloat(target.max)
    const val = parseFloat(target.value)

    target.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%'

    onChange(e.target.value)
    setValue(parseFloat(e.target.value))
  }

  return (
    <>
      <label htmlFor="default-range" className="block text-sm"></label>
      <input
        ref={inputEl}
        id="default-range"
        type="range"
        min="0"
        max={leverageMax}
        step={inputTokenInfo ? 1 / 10 ** inputTokenInfo?.decimals : 6}
        className="w-full"
        onChange={handleSliderChange}
        value={value}
      ></input>
    </>
  )
}

export const SwapLeverageSlider = ({
  amount,
  inputToken,
  outputToken,
  onChange,
}: LeverageSliderProps) => {
  const { amountWithBorrow } = useTokenMax(inputToken, outputToken)

  return (
    <>
      <LeverageSlider
        amount={amount}
        leverageMax={amountWithBorrow}
        onChange={onChange}
      />
    </>
  )
}

export const BorrowLeverageSlider = ({
  amount,
  tokenMax,
  onChange,
}: {
  amount: number
  tokenMax: number
  onChange: (x: any) => any
}) => {
  return (
    <>
      <LeverageSlider
        amount={amount}
        leverageMax={tokenMax}
        onChange={onChange}
      />
    </>
  )
}

export default LeverageSlider
