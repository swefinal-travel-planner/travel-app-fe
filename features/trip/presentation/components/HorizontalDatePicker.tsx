import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { Trip } from '@/features/trip/domain/models/Trip'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type HorizontalDatePickerProps = {
  theme: typeof colorPalettes.light
  trip?: Partial<Trip>
  selectedDate: Date | null
  onSelectDate?: (date: Date) => void
}

export default function HorizontalDatePicker({
  theme,
  trip,
  selectedDate,
  onSelectDate,
}: Readonly<HorizontalDatePickerProps>) {
  if (!trip?.startDate || !trip?.days) return null

  const startDate = new Date(trip.startDate)

  // Generate an array of dates based on the start date and number of days
  const dates = Array.from({ length: trip.days }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    return date
  })

  return (
    <View
      style={[{ backgroundColor: theme?.background ?? 'blue' }, styles.wrapper]}
    >
      {dates.map((date) => {
        const isSelected = date.toDateString() === selectedDate?.toDateString()
        return (
          <TouchableOpacity
            key={date.toDateString()}
            style={[
              styles.dateItem,
              isSelected && { backgroundColor: theme?.primary ?? '#3e5d4f' },
            ]}
            onPress={() => onSelectDate?.(date)}
          >
            <Text style={[styles.dayText, isSelected && styles.selectedText]}>
              {date
                .toLocaleDateString('en-US', {
                  weekday: 'short',
                })
                .toUpperCase()}
            </Text>
            <Text style={[styles.dateText, isSelected && styles.selectedText]}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: Radius.FULL,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  dateItem: {
    width: 40,
    height: 40,
    borderRadius: Radius.FULL,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: FontSize.SM,
    fontFamily: FontFamily.REGULAR,
    color: '#4a3b32',
  },
  dateText: {
    fontSize: FontSize.XL,
    fontFamily: FontFamily.BOLD,
    color: '#4a3b32',
  },
  selectedText: {
    color: 'white',
  },
})
