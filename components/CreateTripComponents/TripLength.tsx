import { colorPalettes } from '@/styles/Itheme'
import React, { useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native-ui-lib'
import DateRangeField from '../Pickers/DateRangeField'
import { StyleSheet } from 'react-native'
import { FontFamily, FontSize } from '@/constants/font'

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

  useEffect(() => {
    console.log(startDate)
  }, [startDate])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.normal }]}>
        When will your trip start and end?
      </Text>
      <View style={styles.textFieldContainer}>
        <Text style={[styles.textField, { color: theme.normal }]}>
          Select a date range
        </Text>
        <DateRangeField
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Text style={[styles.textField, { color: theme.normal }]}>
          Number of days:{' '}
          {startDate && endDate
            ? (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                (1000 * 60 * 60 * 24) +
              1
            : '--'}
        </Text>
      </View>

      <Button
        onPress={nextFn}
        label="Next"
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15 }}
        size="large"
      ></Button>
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
})
