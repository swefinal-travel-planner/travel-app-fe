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
  distance: number
  time: number
}

interface TimeSlotRowProps {
  timeSlot: string
  spots: Spot[]
  onSpotPress: (id: string) => void
}

const TimeSlotRow: React.FC<TimeSlotRowProps> = ({ timeSlot, spots, onSpotPress }) => {
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
        <Text style={styles.timeSlotLabel}>{timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}</Text>
      </View>

      {/* Right Column: Spot Cards */}
      <View style={styles.timeGroup}>
        {sortedSpots.map((spot, index) => {
          return (
            <React.Fragment key={`group-${spot.id}`}>
              {spot.distance != null && spot.time != null && (
                <DistanceTimeIndicator distance={spot.distance} time={spot.time} />
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
      alignItems: 'center',
    },
    timeSlotLabelContainer: {
      width: 20, // Keep your desired narrow width
      paddingTop: 6,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative', // Important for absolute positioning
    },

    timeSlotLabel: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '-90deg' }],
      position: 'absolute',
      minWidth: 100, // Set minimum width needed for your text
      textAlignVertical: 'center',
    },
    timeGroup: {
      flex: 1,
    },
  })

export default TimeSlotRow
