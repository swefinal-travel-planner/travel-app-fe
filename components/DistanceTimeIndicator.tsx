import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface DistanceTimeIndicatorProps {
  distance: number
  time: number
}

const DistanceTimeIndicator: React.FC<DistanceTimeIndicatorProps> = ({ distance, time }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.distanceTimeContainer}>
      <Ionicons name="bicycle-outline" size={14} color={theme.text} style={{ marginRight: 4 }} />
      <Text style={styles.distanceTimeText}>{distance} km</Text>
      <Ionicons name="time-outline" size={14} color={theme.text} style={{ marginLeft: 12, marginRight: 4 }} />
      <Text style={styles.distanceTimeText}>{time} min</Text>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    distanceTimeContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginVertical: 4,
    },
    distanceTimeText: {
      fontSize: FontSize.SM,
      color: theme.text,
      paddingVertical: 2,
      fontFamily: FontFamily.REGULAR,
      backgroundColor: theme.white,
    },
  })

export default DistanceTimeIndicator
