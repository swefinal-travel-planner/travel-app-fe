import { FontFamily, FontSize } from '@/constants/font'
import { useManualTripStore } from '@/store/manualTripStore'
import { colorPalettes } from '@/styles/Itheme'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'react-native-ui-lib'
import DateRangeField from '../Pickers/DateRangeField'

type TripLengthProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function TripLength({
  theme,
  nextFn,
}: Readonly<TripLengthProps>) {
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const setManualTrip = useManualTripStore((state) => state.setManualTrip)

  const getDayDiff = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime()
    return diffMs / (1000 * 60 * 60 * 24) + 1
  }

  const handleNext = () => {
    nextFn() // TODO: remove this line when the next step is implemented

    if (!startDate || !endDate) {
      setErrorMessage('Please select a start and end date.')
      return
    }

    const days = getDayDiff(startDate, endDate)

    if (days > 7) {
      setErrorMessage('Trip length cannot be longer than 7 days.')
      return
    }

    setManualTrip({
      startDate: new Date(startDate),
      numberOfDays: days,
    })

    setErrorMessage(null)
    nextFn()
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        When will your trip start and end?
      </Text>

      <View style={styles.textFieldContainer}>
        <Text style={[styles.textField, { color: theme.primary }]}>
          Select a date range
        </Text>
        <DateRangeField
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Text style={[styles.textField, { color: theme.primary }]}>
          Number of days:{' '}
          {startDate && endDate ? getDayDiff(startDate, endDate) : '--'}
        </Text>

        {errorMessage && (
          <Text style={[styles.errorText, { color: theme.error ?? 'red' }]}>
            {errorMessage}
          </Text>
        )}
      </View>

      <Button
        onPress={handleNext}
        label="Next"
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15 }}
        size="large"
        // disabled={!startDate || !endDate || !!errorMessage} TODO : enable later
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
    paddingBottom: 20,
    paddingTop: '30%',
    paddingHorizontal: 20,
  },
  textFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
  },
  textQuestion: {
    fontFamily: FontFamily.REGULAR,
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
})
