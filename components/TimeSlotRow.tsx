import DistanceTimeIndicator from '@/components/DistanceTimeIndicator'
import SpotCard from '@/components/SpotCard'
import TimeSpent from '@/components/TimeSpent'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
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
  types?: string
}

interface TimeSlotRowProps {
  timeSlot: string
  spots: Spot[]
  marginBottom?: number
  onSpotPress: (id: string) => void
}

const TimeSlotRow: React.FC<TimeSlotRowProps> = ({ timeSlot, spots, onSpotPress, marginBottom }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme, marginBottom || 0), [theme])

  const sortedSpots = spots.filter((spot) => spot.timeSlot === timeSlot).sort((a, b) => a.orderInTrip - b.orderInTrip)

  if (sortedSpots.length === 0) {
    return null
  }

  return (
    <View style={styles.timeSlotRow}>
      <View style={styles.timeGroup}>
        {sortedSpots.map((spot, index) => {
          const distance = spot.distance
          const time = spot.time
          const isFirstSpot = index === 0

          return (
            <React.Fragment key={`group-${spot.id}`}>
              <View style={styles.distanceTimeRow}>
                {/* Only show label inline with distance indicator for first spot */}
                {isFirstSpot && (
                  <View style={styles.inlineTimeSlotLabelContainer}>
                    <Text style={styles.timeSlotLabel}>{timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}</Text>
                  </View>
                )}

                {!!distance && !!time && (
                  <View style={styles.distanceTimeWrapper}>
                    <DistanceTimeIndicator distance={distance} time={time} />
                  </View>
                )}
              </View>

              <View style={styles.spotCardContainer}>
                <View style={{ flex: 1, minWidth: 100 }}>
                  <SpotCard
                    id={spot.id}
                    name={spot.name}
                    address={spot.address}
                    image={spot.image}
                    onPress={onSpotPress}
                  />
                </View>
                <TimeSpent types={spot.types} style={styles.timeSpent} />
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
      alignItems: 'stretch',
    },
    timeSpent: {
      width: 30,
      marginLeft: 8,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: 20,
      height: 20,
      borderRadius: Radius.FULL,
      backgroundColor: theme.dimText,
      marginRight: -25,
      borderWidth: 7,
      borderColor: theme.white,
      alignSelf: 'center',
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
      // No marginHorizontal since we're already inside timeGroup with paddingLeft
    },
    timeSlotLabel: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      textAlign: 'center',
      lineHeight: 20,
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
