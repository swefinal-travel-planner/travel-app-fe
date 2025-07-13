import DistanceTimeIndicator from '@/components/DistanceTimeIndicator'
import SpotCard from '@/components/SpotCard'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Spot {
  id: string
  name: string
  address: string
  image: { uri: string }
  timeSlot: string
  orderInTrip: number
  orderInDay: number
}

interface DistanceTime {
  distance: string
  time: string
}

interface TimeSlotRowProps {
  timeSlot: string
  spots: Spot[]
  distanceTimes: DistanceTime[]
  onSpotPress: (id: string) => void
}

const TimeSlotRow: React.FC<TimeSlotRowProps> = ({ timeSlot, spots, distanceTimes, onSpotPress }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const sortedSpots = spots.filter((spot) => spot.timeSlot === timeSlot).sort((a, b) => a.orderInTrip - b.orderInTrip)

  if (sortedSpots.length === 0) {
    return null
  }

  return (
    <View style={styles.timeSlotRow}>
      {/* Left Column: Time Slot */}
      <View style={styles.timeSlotLabelContainer}>
        <Text style={styles.timeSlotLabel}>
          {(timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)).split('').join('\n')}
        </Text>
      </View>

      {/* Right Column: Spot Cards */}
      <View style={styles.timeGroup}>
        {sortedSpots.map((spot, index) => {
          const distanceTimeIndex = spot.orderInTrip > 0 ? spot.orderInTrip - 1 : -1
          const distanceTime = distanceTimeIndex >= 0 ? distanceTimes[distanceTimeIndex] : null

          return (
            <React.Fragment key={`group-${spot.id}`}>
              {index > 0 && distanceTime && (
                <DistanceTimeIndicator distance={distanceTime.distance} time={distanceTime.time} />
              )}
              <SpotCard id={spot.id} name={spot.name} address={spot.address} image={spot.image} onPress={onSpotPress} />
            </React.Fragment>
          )
        })}
      </View>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    timeSlotRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 24,
    },
    timeSlotLabelContainer: {
      width: 40,
      paddingTop: 6,
      alignItems: 'center',
    },
    timeSlotLabel: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      textAlign: 'center',
      lineHeight: 20,
    },
    timeGroup: {
      marginBottom: 20,
      flex: 1,
    },
  })

export default TimeSlotRow
