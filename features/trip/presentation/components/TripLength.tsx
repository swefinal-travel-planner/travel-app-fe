import DateRangeField from '@/components/Pickers/DateRangeField'
import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { TripRequest, useAiTripStore } from '@/store/useAiTripStore'
import { DebugWrapper } from '@/utils/DebugWrapper'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'

type TripLengthProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
  setTripState?: (trip: Partial<TripRequest>) => void
  getTripState?: TripRequest | null
}

const addDays = (date: string | undefined, days: number | undefined) => {
  if (date == null || days == null || isNaN(new Date(date).getTime())) {
    return null
  }

  const newDate = new Date(date)
  newDate.setDate(new Date(date).getDate() + days)
  return formatDate(newDate)
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function TripLength({ theme, nextFn, setTripState, getTripState }: Readonly<TripLengthProps>) {
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date)
    setErrorMessage(null)
  }

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date)
    setErrorMessage(null)
  }

  const getDayDiff = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime()
    return diffMs / (1000 * 60 * 60 * 24) + 1
  }

  const handleNext = () => {
    if (!startDate || !endDate) {
      setErrorMessage('Please select a start and end date.')
      return
    }

    const days = getDayDiff(startDate, endDate)

    if (days > 7) {
      setErrorMessage('Trip length cannot be longer than 7 days.')
      return
    }

    setTripState?.({
      startDate,
      days,
    })

    setErrorMessage(null)
    nextFn()
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>When will your trip start and end?</Text>
      <View style={styles.textFieldContainer}>
        <DateRangeField
          startDate={startDate}
          endDate={endDate}
          setStartDate={handleStartDateChange}
          setEndDate={handleEndDateChange}
        />

        <Text style={[styles.textField, { color: theme.primary, marginTop: 40 }]}>
          {startDate && endDate ? `Number of days: ${getDayDiff(startDate, endDate)}` : ''}
        </Text>

        {errorMessage && <Text style={[styles.errorText, { color: theme.error ?? 'red' }]}>{errorMessage}</Text>}
      </View>

      <Pressable
        onPress={handleNext}
        title="Next"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
        disabled={!startDate || !endDate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  textFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  textQuestion: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: FontFamily.BOLD,
    fontSize: FontSize.XXXL,
  },
  textField: {
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.XL,
  },
  errorText: {
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.XL,
  },
  dateField: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    padding: 12,
    backgroundColor: colorPalettes.light.background,
    color: colorPalettes.light.primary,
  },
})
