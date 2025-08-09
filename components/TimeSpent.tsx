import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { getDefaultTimeSpentFromTypes } from '@/utils/TypeBadges'
import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

interface TimeSpentProps {
  minutes?: number
  types?: string
  style?: StyleProp<ViewStyle>
}

const TimeSpent: React.FC<TimeSpentProps> = ({ minutes, types, style }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const computedMinutes =
    typeof minutes === 'number' ? Math.round(minutes) : getDefaultTimeSpentFromTypes(types || '', 60)
  const quantizedMinutes = Math.max(30, Math.round(computedMinutes / 30) * 30)

  const hours = Math.floor(quantizedMinutes / 60)
  const remainingMinutes = quantizedMinutes % 60

  const hasHalfHour = remainingMinutes === 30
  let displayHours: string
  if (hasHalfHour) {
    displayHours = hours > 0 ? `${hours}.5` : '0.5'
  } else {
    displayHours = `${hours}`
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.primaryText}>{`${displayHours}h`}</Text>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryText: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      lineHeight: 16,
    },
    secondaryText: {
      fontSize: FontSize.XS,
      fontFamily: FontFamily.REGULAR,
      color: theme.dimText,
      lineHeight: 14,
    },
  })

export default TimeSpent
