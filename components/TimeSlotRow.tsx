import DistanceTimeIndicator from '@/components/DistanceTimeIndicator'
import SpotCard from '@/components/SpotCard'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useEffect, useMemo } from 'react'
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
  distanceTimes: DistanceTime[]
  marginBottom?: number
  onSpotPress: (id: string) => void
}

const TimeSlotRow: React.FC<TimeSlotRowProps> = ({ timeSlot, spots, distanceTimes, onSpotPress, marginBottom }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme, marginBottom || 0), [theme])

  const sortedSpots = spots.filter((spot) => spot.timeSlot === timeSlot).sort((a, b) => a.orderInTrip - b.orderInTrip)

  if (sortedSpots.length === 0) {
    return null
  }

  useEffect(() => {
    // Log the time slot and sorted spots for debugging
    console.log(`Time Slot: ${timeSlot}`, sortedSpots)
    console.log('Distance Times:', distanceTimes)
  }, [timeSlot, sortedSpots, distanceTimes])

  // Check if the first spot has a distance indicator (to determine label positioning)
  const firstSpotHasDistanceIndicator =
    sortedSpots.length > 0 &&
    sortedSpots[0].orderInDay > 1 &&
    distanceTimes[sortedSpots[0].orderInTrip > 0 ? sortedSpots[0].orderInTrip - 1 : -1]

  return (
    <View style={styles.timeSlotRow}>
      {/* Show time slot label separately if first spot doesn't have distance indicator */}
      {!firstSpotHasDistanceIndicator && (
        <View style={styles.timeSlotLabelContainer}>
          <Text style={styles.timeSlotLabel}>{timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}</Text>
        </View>
      )}

      <View style={styles.timeGroup}>
        {sortedSpots.map((spot, index) => {
          const distanceTimeIndex = spot.orderInTrip > 0 ? spot.orderInTrip - 1 : -1
          const distanceTime = distanceTimeIndex >= 0 ? distanceTimes[distanceTimeIndex] : null
          const isFirstSpot = index === 0

          return (
            <React.Fragment key={`group-${spot.id}`}>
              {spot.orderInDay > 1 && distanceTime && (
                <View style={styles.distanceTimeRow}>
                  {/* Only show label inline with distance indicator for first spot */}
                  {isFirstSpot && (
                    <View style={styles.inlineTimeSlotLabelContainer}>
                      <Text style={styles.timeSlotLabel}>{timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}</Text>
                    </View>
                  )}
                  <View style={styles.distanceTimeWrapper}>
                    <DistanceTimeIndicator distance={distanceTime.distance} time={distanceTime.time} />
                  </View>
                </View>
              )}
              <View style={styles.spotCardContainer}>
                <SpotCard
                  id={spot.id}
                  name={spot.name}
                  address={spot.address}
                  image={spot.image}
                  onPress={onSpotPress}
                />
                <View style={styles.dot} />
              </View>
            </React.Fragment>
          )
        })}
      </View>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light, marginBottom: number) =>
  StyleSheet.create({
    timeSlotRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: marginBottom || 0,
    },
    spotCardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: Radius.FULL,
      backgroundColor: theme.dimText,
      marginLeft: 8,
      marginRight: -21,
      borderWidth: 2,
      borderColor: theme.white,
    },
    timeSlotLabelContainer: {
      paddingTop: 6,
      marginHorizontal: 24,
      marginBottom: 8,
      alignItems: 'center',
      minWidth: 80,
    },
    inlineTimeSlotLabelContainer: {
      paddingTop: 6,
      marginBottom: 8,
      alignItems: 'center',
      minWidth: 80,
    },
    timeSlotLabel: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '-90deg' }],
      position: 'absolute',
      minWidth: 100,
      textAlignVertical: 'center',
    },
    timeGroup: {
      width: '100%',
      paddingLeft: 24,
      paddingRight: 16,
    },
    distanceTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    distanceTimeWrapper: {
      flex: 1,
    },
  })

export default TimeSlotRow
