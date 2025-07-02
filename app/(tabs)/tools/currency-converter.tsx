import CurrencyPicker from '@/components/CurrencyPicker'
import Currencies from '@/constants/currencies'
import { apiGetCurrencies } from '@/services/api/tools/ApiCurrency'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('')
  const [convertedAmount, setConvertedAmount] = useState('')
  const [originalCurrency, setOriginalCurrency] = useState(Currencies[0])
  const [convertedCurrency, setConvertedCurrency] = useState(Currencies[32])
  const [exchangeRate, setExchangeRate] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  // Function to handle conversion
  const handleExchange = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setConvertedAmount('')
      return
    }

    setIsLoading(true)
    try {
      const rate = await apiGetCurrencies(
        originalCurrency.abbreviation.toLowerCase(),
        convertedCurrency.abbreviation.toLowerCase()
      )

      if (rate) {
        setExchangeRate(rate)
        const converted = (parseFloat(amount) * rate).toFixed(2)
        setConvertedAmount(converted)
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
      setConvertedAmount('Error')
    } finally {
      setIsLoading(false)
    }
  }, [amount, originalCurrency, convertedCurrency])

  // Debounce effect: runs only after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      handleExchange()
    }, 600)

    return () => clearTimeout(timer)
  }, [handleExchange])

  // Function to swap currencies
  const swapCurrencies = () => {
    const temp = originalCurrency
    setOriginalCurrency(convertedCurrency)
    setConvertedCurrency(temp)
    setAmount(convertedAmount)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.originalCurrencyBox}>
        <CurrencyPicker
          selectedCurrency={originalCurrency}
          onSelect={setOriginalCurrency}
          style={styles.pickerStyle}
          placeholder="Select source currency"
        />

        {/* Input Field */}
        <TextInput
          style={styles.input}
          value={amount}
          placeholder={t('currencyConverter.enterAmount')}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      {/* Swap Button */}
      <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
        <Ionicons name="swap-vertical" size={20} color="#563d30" />
      </TouchableOpacity>

      <View style={styles.convertedCurrencyBox}>
        <CurrencyPicker
          selectedCurrency={convertedCurrency}
          onSelect={setConvertedCurrency}
          style={styles.pickerStyle}
          placeholder="Select target currency"
        />

        {/* Result Display */}
        <Text style={styles.resultText}>
          {isLoading
            ? 'Converting...'
            : convertedAmount
              ? `${convertedAmount} ${convertedCurrency.abbreviation.toUpperCase()}`
              : t('currencyConverter.result')}
        </Text>

        {/* Exchange Rate Display */}
        {exchangeRate > 0 && !isLoading && (
          <Text style={styles.rateText}>
            1 {originalCurrency.abbreviation.toUpperCase()} = {exchangeRate.toFixed(4)}{' '}
            {convertedCurrency.abbreviation.toUpperCase()}
          </Text>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  originalCurrencyBox: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    padding: 10,
  },
  convertedCurrencyBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
  },
  pickerStyle: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    fontSize: 25,
    color: '#563d30',
    paddingTop: 10,
    marginBottom: 30,
    marginHorizontal: 10,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  resultText: {
    color: '#563d30',
    height: 50,
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 10,
  },
  rateText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  swapButton: {
    backgroundColor: '#e5dacb',
    borderRadius: 100,
    padding: 20,
    position: 'absolute',
    top: 242,
    zIndex: 1,
  },
})
