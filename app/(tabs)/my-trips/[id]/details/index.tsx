import DayNavigation from '@/components/DayNavigation'
import LoadingScreen from '@/components/LoadingScreen'
import NoItemsMessage from '@/components/NoItemsMessage'
import Pressable from '@/components/Pressable'
import TimeSlotRow from '@/components/TimeSlotRow'
import TripInfoCard from '@/components/TripInfoCard'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripDetails } from '@/hooks/useTripDetails'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

const TripDetailViewScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const { trip, tripItems, groupedItems, activeDay, loading, goToPreviousDay, goToNextDay } = useTripDetails(
    id as string
  )

  const handleEditTrip = () => {
    router.push({
      pathname: '/my-trips/[id]/details/modify',
      params: {
        id: trip?.id ?? '',
        tripData: JSON.stringify(groupedItems),
      },
    })
  }

  const handleSpotDetail = (id: string) => {
    let spot = tripItems.find((item) => item.placeID === id)?.placeInfo

    router.push({
      pathname: '/places/[id]',
      params: {
        id: spot?.id ?? '',
        name: spot?.name,
        lng: spot?.location.long.toString(),
        lat: spot?.location.lat.toString(),
        properties: spot?.properties.join(' '),
        address: spot?.address,
        types: spot?.type,
        images: JSON.stringify(spot?.images),
      },
    })
  }

  if (loading || !trip) {
    return <LoadingScreen />
  }

  const timeSlots = ['morning', 'afternoon', 'evening', 'night']

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Trip Info Card */}
        <TripInfoCard trip={trip} />

        {/* Day Navigation */}
        <DayNavigation
          groupedItems={groupedItems}
          activeDay={activeDay}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
        />

        {/* Spots List */}
        {groupedItems.length === 0 ? (
          <NoItemsMessage />
        ) : (
          <View style={styles.spotsContainer}>
            <View style={styles.spotsList}>
              {groupedItems[activeDay] &&
                timeSlots
                  .filter((timeSlot) => groupedItems[activeDay].spots.some((spot) => spot.timeSlot === timeSlot))
                  .map((timeSlot, index) => (
                    <TimeSlotRow
                      key={timeSlot}
                      timeSlot={timeSlot}
                      spots={groupedItems[activeDay].spots}
                      distanceTimes={distanceTimes}
                      onSpotPress={handleSpotDetail}
                      marginBottom={index === timeSlots.length - 1 ? 0 : 24}
                    />
                  ))}
            </View>
            <View style={styles.rightBorder} />
          </View>
        )}
      </ScrollView>

      {/* Edit Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          title="Edit"
          style={{ color: theme.white, backgroundColor: theme.primary }}
          onPress={handleEditTrip}
        />
      </View>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },
    content: {
      flex: 1,
      marginTop: 20,
    },
    buttonContainer: {
      marginVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: 'transparent',
    },
    spotsContainer: {
      position: 'relative',
    },
    spotsList: {
      marginRight: 24,
    },
    rightBorder: {
      position: 'absolute',
      right: 24,
      top: 36,
      bottom: 36,
      width: 1,
      zIndex: -1,
      backgroundColor: theme.dimText,
    },
  })

export default TripDetailViewScreen
