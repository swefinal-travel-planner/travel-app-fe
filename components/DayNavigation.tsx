import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface DayNavigationProps {
  groupedItems: { day: number; date: string; spots: any[] }[]
  activeDay: number
  onPreviousDay: () => void
  onNextDay: () => void
}

const DayNavigation: React.FC<DayNavigationProps> = ({ groupedItems, activeDay, onPreviousDay, onNextDay }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  if (groupedItems.length === 0) {
    return null
  }

  return (
    <View style={styles.dayNavigationContainer}>
      <TouchableOpacity onPress={onPreviousDay} style={styles.dayNavigationButton} disabled={activeDay === 0}>
        <Ionicons name="chevron-back" size={20} color={activeDay === 0 ? theme.disabled : theme.text} />
      </TouchableOpacity>

      {groupedItems[activeDay] && (
        <Text style={styles.dayText}>
          Day {groupedItems[activeDay].day} ({groupedItems[activeDay].date})
        </Text>
      )}

      <TouchableOpacity
        onPress={onNextDay}
        style={styles.dayNavigationButton}
        disabled={activeDay === groupedItems.length - 1}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={activeDay === groupedItems.length - 1 ? theme.disabled : theme.text}
        />
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    dayNavigationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 24,
      marginVertical: 10,
    },
    dayNavigationButton: {
      padding: 8,
    },
    dayText: {
      flex: 1,
      textAlign: 'center',
      fontSize: FontSize.XXL,
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      marginTop: -4,
    },
  })

export default DayNavigation
