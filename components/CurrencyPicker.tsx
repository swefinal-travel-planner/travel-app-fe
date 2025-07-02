import { UniversalPicker } from '@/components/CommonPicker'
import Currencies from '@/constants/currencies'
import { useMemo } from 'react'

type Currency = (typeof Currencies)[number]

interface CurrencyPickerProps {
  selectedCurrency: Currency
  onSelect: (currency: Currency) => void
  style?: any
  placeholder?: string
}

export default function CurrencyPicker({
  selectedCurrency,
  onSelect,
  style,
  placeholder = 'Select Currency',
}: Readonly<CurrencyPickerProps>) {
  const currencyData = useMemo(() => Currencies, [])

  return (
    <UniversalPicker
      data={currencyData}
      keyExtractor={(item) => item.abbreviation}
      labelExtractor={(item) => item.abbreviation.toUpperCase() + ' - ' + item.name}
      iconExtractor={(item) => item.image}
      initialValue={selectedCurrency}
      onSelect={onSelect}
      placeholder={placeholder}
      style={style}
    />
  )
}
