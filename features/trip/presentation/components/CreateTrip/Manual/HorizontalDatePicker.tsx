import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { TripRequest } from '@/store/useAiTripStore'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type HorizontalDatePickerProps = {
  request?: Partial<TripRequest | null>
  selectedDate: Date | null
  onSelectDate?: (date: Date) => void
}

export default function HorizontalDatePicker({
  request,
  selectedDate,
  onSelectDate,
}: Readonly<HorizontalDatePickerProps>) {
  const theme = useThemeStyle()

  // Create dynamic styles based on theme
  const styles = createStyles(theme)

  if (!request?.startDate || !request?.days) return null

  const startDate = new Date(request.startDate)

  // Generate an array of dates based on the start date and number of days
  const dates = Array.from({ length: request.days }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    return date
  })

  // Select the first date if no date is selected
  const effectiveSelectedDate = selectedDate || dates[0]

  return (
    <View style={styles.wrapper}>
      {dates.map((date) => {
        const isSelected = date.toDateString() === effectiveSelectedDate?.toDateString()
        return (
          <TouchableOpacity
            key={date.toDateString()}
            style={[styles.dateItem, isSelected && styles.selectedDateItem]}
            onPress={() => onSelectDate?.(date)}
          >
            <Text style={[styles.dayText, isSelected && styles.selectedText]}>
              {date
                .toLocaleDateString('en-US', {
                  weekday: 'short',
                })
                .toUpperCase()}
            </Text>
            <Text style={[styles.dateText, isSelected && styles.selectedText]}>{date.getDate()}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      paddingVertical: 10,
      borderRadius: Radius.FULL,
      marginBottom: 20,
      marginHorizontal: 10,
      backgroundColor: theme.white,
    },
    dateItem: {
      width: 48,
      height: 48,
      borderRadius: Radius.FULL,
      marginHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    selectedDateItem: {
      backgroundColor: theme.primary,
    },
    dayText: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: theme.primary,
    },
    dateText: {
      marginTop: -4,
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
    },
    selectedText: {
      color: 'white',
    },
  })
