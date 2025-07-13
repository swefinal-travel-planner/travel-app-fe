import Pressable from '@/components/Pressable'
import PressableOpacity from '@/components/PressableOpacity'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi, { safeBeApiCall } from '@/lib/beApi'
import coreApi, { safeCoreApiCall } from '@/lib/coreApi'
import { Trip, TripItem } from '@/lib/types/Trip'
import { formatTripStatus } from '@/utils/tripAttributes'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type DistanceTime = {
  distance: string
  time: string
}

const TripDetailViewScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [trip, setTrip] = useState<Trip>()
  const [tripItems, setTripItems] = useState<TripItem[]>([])
  const [groupedItems, setGroupedItems] = useState<{ day: number; date: string; spots: any[] }[]>([])
  const [distanceTimes, setDistanceTimes] = useState<DistanceTime[]>([])

  const [activeDay, setActiveDay] = useState(0)
  const router = useRouter()

  const handleEditTrip = () => {
    if (!trip || groupedItems.length === 0) {
      console.warn('No trip data available for editing.')
      return
    }

    router.push({
      pathname: '/my-trips/[id]/details/modify',
      params: {
        id: trip.id,
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

  const { id } = useLocalSearchParams()

  const getTripDetail = async () => {
    try {
      const tripData = await safeBeApiCall(() => beApi.get(`/trips/${id}`))
      setTrip(tripData.data.data)
    } catch (error) {
      console.error('Error fetching trip detail by ID:', error)
    }
  }

  const getTripItems = async () => {
    if (!trip?.startDate) {
      console.warn('Trip startDate is undefined — skipping item grouping.')
      return
    }
    try {
      const tripItemData = await beApi.get(`/trips/${id}/trip-items?language=en`)

      // Check if the response data is null or undefined
      if (!tripItemData.data?.data) {
        console.warn('No trip items data received from API')
        setTripItems([])
        setDistanceTimes([])
        setGroupedItems([])
        return
      }

      let items: TripItem[] = tripItemData.data.data

      // Check if items array is empty
      if (!items || items.length === 0) {
        console.warn('No trip items found')
        setTripItems([])
        setDistanceTimes([])
        setGroupedItems([])
        return
      }

      const placeIDs = items.map((item) => item.placeID)

      items = items.map((item, index) => ({
        ...item,
        orderInTrip: index, // Thêm trường orderInTrip để xác định thứ tự trong chuyến đi
      }))

      setTripItems(items)

      // Lấy thông tin khoảng cách và thời gian di chuyển giữa các địa điểm từ API
      const distanceTimeData = await safeCoreApiCall(() => coreApi.post(`/distance_time/calc`, { place_ids: placeIDs }))

      // If response is null, it means it was a silent error
      if (!distanceTimeData) {
        setDistanceTimes([])
        return
      }

      setDistanceTimes(
        distanceTimeData.data.data.map((item: any) => ({
          distance: item.distance,
          time: item.time,
        }))
      )

      // Nhóm items theo ngày
      const start = trip?.startDate ? new Date(trip.startDate) : new Date()

      const grouped: { [day: number]: TripItem[] } = {}
      items.forEach((item) => {
        if (!grouped[item.tripDay]) grouped[item.tripDay] = []
        grouped[item.tripDay].push(item)
      })

      const groupedList = Object.entries(grouped)
        .map(([dayStr, items]) => {
          const day = parseInt(dayStr)
          const currentDate = new Date(start)
          currentDate.setDate(start.getDate() + day - 1)

          return {
            day,
            date: formatDate(currentDate),
            spots: items
              .sort((a, b) => a.orderInDay - b.orderInDay)
              .map((spot) => ({
                id: spot.placeID,
                tripDay: spot.tripDay,
                name: spot.placeInfo?.name ?? 'Unknown',
                address: spot.placeInfo?.address ?? 'Unknown address',
                image: { uri: spot.placeInfo?.images?.[0] ?? '' },
                timeSlot: spot.timeInDate,
                orderInTrip: spot.orderInTrip,
                orderInDay: spot.orderInDay,
              })),
          }
        })
        .sort((a, b) => a.day - b.day)

      setGroupedItems(groupedList)
    } catch (error) {
      console.error('Error fetching trip items:', error)
    }
  }

  useEffect(() => {
    getTripDetail()
  }, [id])

  useEffect(() => {
    if (trip) {
      getTripItems()
    }
  }, [trip])

  // Chuyển ngày
  const goToPreviousDay = () => {
    if (activeDay > 0) {
      setActiveDay(activeDay - 1)
    }
  }
  const goToNextDay = () => {
    if (activeDay < tripItems.length - 1) {
      setActiveDay(activeDay + 1)
    }
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <Text>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Trip Info Card */}
        <View style={styles.tripCard}>
          <Text style={styles.destinationText}>{trip.title}</Text>
          <Text style={styles.dateAndCostText}>
            {formatDate(new Date(trip.startDate))} - {calculateEndDate(trip.startDate, trip.days)}
          </Text>

          <View style={styles.tripInfoRow}>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Location</Text>
              <Text style={styles.tripInfoValue}>{trip.city}</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Members</Text>
              <Text style={styles.tripInfoValue}>{trip.memberCount}</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Status</Text>
              <Text style={styles.tripInfoValue}>{formatTripStatus(trip.status)}</Text>
            </View>
          </View>
        </View>

        {/* Day Navigation */}
        <View style={styles.dayNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDay} style={styles.dayNavigationButton} disabled={activeDay === 0}>
            <Ionicons name="chevron-back" size={20} color={activeDay === 0 ? theme.disabled : theme.text} />
          </TouchableOpacity>

          {groupedItems[activeDay] && (
            <Text style={styles.dayText}>
              Day {groupedItems[activeDay].day} ({groupedItems[activeDay].date})
            </Text>
          )}

          <TouchableOpacity
            onPress={goToNextDay}
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

        <Text style={styles.mapInstructionText}>Tap a spot to view its details</Text>

        {/* Spots List */}
        {groupedItems.length === 0 ? (
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>No trip items found</Text>
            <Text style={styles.noItemsSubText}>This trip doesn't have any planned spots yet.</Text>
          </View>
        ) : (
          groupedItems[activeDay] &&
          ['morning', 'afternoon', 'evening', 'night']
            .filter((timeSlot) => groupedItems[activeDay].spots.some((spot) => spot.timeSlot === timeSlot))
            .map((timeSlot) => (
              <View style={styles.timeGroup} key={timeSlot}>
                <Text style={styles.timeGroupTitle}>{timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}</Text>
                {groupedItems[activeDay].spots
                  .filter((spot) => spot.timeSlot === timeSlot)
                  .map((spot) => {
                    // Skip first spot (orderInTrip === 0) for distance/time data
                    const distanceTimeIndex = spot.orderInTrip > 0 ? spot.orderInTrip - 1 : -1
                    const distanceTime = distanceTimeIndex >= 0 ? distanceTimes[distanceTimeIndex] : null

                    return (
                      <PressableOpacity key={spot.id} onPress={() => handleSpotDetail(spot.id)}>
                        <View style={styles.spotCard}>
                          <View style={styles.spotImageContainer}>
                            <Image source={spot.image} style={styles.spotImage} />
                          </View>
                          <View style={styles.spotDetails}>
                            <Text style={styles.spotName}>{spot.name}</Text>
                            <View style={styles.spotLocationContainer}>
                              <Ionicons name="location-outline" size={14} color={theme.text} />
                              <Text style={styles.spotAddress} numberOfLines={1}>
                                {spot.address}
                              </Text>
                            </View>
                            {distanceTime && spot.orderInDay !== 1 && (
                              <View style={styles.spotDistanceTimeContainer}>
                                <Ionicons name="car-outline" size={14} color={theme.text} />
                                <Text style={styles.spotAddress} numberOfLines={1}>
                                  {distanceTime.distance} km
                                </Text>
                                <Ionicons name="time-outline" size={14} color={theme.text} />
                                <Text style={styles.spotAddress} numberOfLines={1}>
                                  {distanceTime.time} min
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </PressableOpacity>
                    )
                  })}
              </View>
            ))
        )}
      </ScrollView>

      {/* Edit Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          title="Edit"
          style={{ color: theme.white, backgroundColor: theme.primary }}
          onPress={handleEditTrip}
        ></Pressable>
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
    tripCard: {
      backgroundColor: theme.secondary,
      borderRadius: Radius.ROUNDED,
      padding: 16,
      marginBottom: 20,
      marginHorizontal: 24,
    },
    destinationText: {
      fontSize: FontSize.XXXL,
      textAlign: 'center',
      color: theme.primary,
      marginBottom: 4,
      fontFamily: FontFamily.BOLD,
    },
    dateAndCostText: {
      textAlign: 'center',
      marginBottom: 12,
      fontSize: FontSize.MD,
      color: theme.primary,
      fontFamily: FontFamily.REGULAR,
    },
    tripInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    tripInfoItem: {
      alignItems: 'center',
      flex: 1,
    },
    tripInfoLabel: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      marginBottom: 2,
    },
    tripInfoValue: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
    },
    dayNavigationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      marginHorizontal: 24,
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
    mapInstructionText: {
      fontSize: FontSize.SM,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 28,
      fontFamily: FontFamily.REGULAR,
    },
    spotCard: {
      flexDirection: 'row',
      borderRadius: Radius.ROUNDED,
      height: 100,
      marginBottom: 12,
      overflow: 'hidden',
      backgroundColor: theme.secondary,
      marginHorizontal: 24,
    },
    spotImageContainer: {
      width: 120,
      height: 'auto',
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spotImage: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.NORMAL,
      backgroundColor: theme.disabled,
    },
    spotDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    spotName: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.LG,
      marginBottom: 2,
      color: theme.primary,
      paddingRight: 8,
    },
    spotLocationContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingRight: 20,
      marginTop: 4,
    },
    spotDistanceTimeContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingRight: 20,
      marginTop: 4,
    },
    spotAddress: {
      color: theme.text,
      marginLeft: 2,
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.SM,
      flex: 1,
      flexWrap: 'wrap',
      marginRight: 8,
    },
    buttonContainer: {
      marginVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: 'transparent',
    },
    timeGroup: {
      marginBottom: 20,
    },
    timeGroupTitle: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 8,
      marginLeft: 24,
    },
    noItemsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      marginHorizontal: 24,
    },
    noItemsText: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    noItemsSubText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      textAlign: 'center',
      opacity: 0.7,
    },
  })

export default TripDetailViewScreen

const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const calculateEndDate = (startDate: string, days: number) => {
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(start.getDate() + days - 1)
  return formatDate(end)
}
