import CurrencyPicker from '@/components/CurrencyPicker'
import { colorPalettes } from '@/constants/Itheme'
import Currencies from '@/constants/currencies'
import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { apiGetCurrencies } from '@/services/api/tools/ApiCurrency'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function CurrencyConverter() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
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

  // Effect to handle currency changes immediately
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      handleExchange()
    }
  }, [originalCurrency, convertedCurrency])

  // Function to swap currencies
  const swapCurrencies = () => {
    const temp = originalCurrency
    setOriginalCurrency(convertedCurrency)
    setConvertedCurrency(temp)
    setAmount(convertedAmount)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Source Currency Card */}
        <View style={styles.currencyCard}>
          <Text style={styles.cardTitle}>From</Text>
          <CurrencyPicker
            selectedCurrency={originalCurrency}
            onSelect={setOriginalCurrency}
            style={styles.pickerStyle}
            placeholder="Select source currency"
          />

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              placeholder="0.00"
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
          <Ionicons name="swap-horizontal" size={24} color="white" />
        </TouchableOpacity>

        {/* Target Currency Card */}
        <View style={styles.currencyCard}>
          <Text style={styles.cardTitle}>To</Text>
          <CurrencyPicker
            selectedCurrency={convertedCurrency}
            onSelect={setConvertedCurrency}
            style={styles.pickerStyle}
            placeholder="Select target currency"
          />

          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Converted Amount</Text>
            <Text style={styles.resultText}>
              {isLoading ? 'Converting...' : convertedAmount ? `${convertedAmount}` : '0.00'}
            </Text>
            <Text style={styles.resultCurrency}>{convertedCurrency.abbreviation.toUpperCase()}</Text>
          </View>
        </View>

        {/* Exchange Rate Card */}
        {exchangeRate > 0 && !isLoading && (
          <View style={styles.rateCard}>
            <Text style={styles.rateTitle}>Exchange Rate</Text>
            <View style={styles.rateContainer}>
              <View style={styles.rateItem}>
                <Text style={styles.rateValue}>1</Text>
                <Text style={styles.rateCurrency}>{originalCurrency.abbreviation.toUpperCase()}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={theme.primary} />
              <View style={styles.rateItem}>
                <Text style={styles.rateValue}>{exchangeRate.toFixed(3)}</Text>
                <Text style={styles.rateCurrency}>{convertedCurrency.abbreviation.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
      paddingTop: 110,
      position: 'relative',
    },
    currencyCard: {
      backgroundColor: 'white',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: Radius.ROUNDED,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 16,
    },
    pickerStyle: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
      borderRadius: Radius.FULL,
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 10,
    },
    inputLabel: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      height: 60,
      fontSize: FontSize.XXL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      paddingHorizontal: 20,
      backgroundColor: theme.background,
      borderRadius: Radius.NORMAL,
      textAlign: 'center',
    },
    swapButton: {
      backgroundColor: theme.primary,
      borderRadius: 100,
      padding: 16,
      position: 'absolute',
      top: 240,
      zIndex: 1,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    resultContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    resultLabel: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginBottom: 8,
    },
    resultText: {
      fontSize: FontSize.XXL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 4,
    },
    resultCurrency: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
    },
    rateCard: {
      backgroundColor: 'white',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: Radius.ROUNDED,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    rateTitle: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    rateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rateItem: {
      alignItems: 'center',
      flex: 1,
    },
    rateValue: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    rateCurrency: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginTop: 4,
    },
  })
