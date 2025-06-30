import Pressable from '@/components/Pressable'
import PressableOpacity from '@/components/PressableOpacity'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { Trip, TripItem } from '@/lib/types/Trip'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useMemo, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const url = process.env.EXPO_PUBLIC_BE_API_URL

const TripDetailViewScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [trip, setTrip] = useState<Trip>()
  const [tripItems, setTripItems] = useState<TripItem[]>([])
  const [groupedItems, setGroupedItems] = useState<{ day: number; date: string; spots: any[] }[]>([])

  const [activeDay, setActiveDay] = useState(0)
  const router = useRouter()

  const handleEditTrip = () => {
    if (!trip || groupedItems.length === 0) {
      console.warn('No trip data available for editing.')
      return
    }

    router.push({
      pathname: `my-trips/${trip.id}/details/modify`,
      params: {
        tripData: JSON.stringify(groupedItems[activeDay]?.spots ?? []),
        tripDate: groupedItems[activeDay]?.date ?? '',
        tripDay: groupedItems[activeDay]?.day ?? 1,
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
      const tripData = await beApi.get(`/trips/${id}`)
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
      const tripItemData = await beApi.get(`/trips/${id}/trip-items`)

      const items: TripItem[] = tripItemData.data.data
      console.log(tripItemData.data.data)
      setTripItems(items)

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
                name: spot.placeInfo?.name ?? 'Unknown',
                address: spot.placeInfo?.address ?? 'Unknown address',
                image: { uri: spot.placeInfo?.images?.[0] ?? '' },
                timeSlot: spot.timeInDate,
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
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.content}>
        {/* Trip Info Card */}
        <View style={styles.tripCard}>
          <Text style={styles.destinationText}>{trip.title}</Text>
          <Text style={styles.dateAndCostText}>
            {formatDate(new Date(trip.startDate))} - {calculateEndDate(trip.startDate, trip.days)}
          </Text>

          <View style={styles.tripInfoRow}>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Budget</Text>
              <Text style={styles.tripInfoValue}>{trip.budget.toLocaleString('vi-VN')}</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Members</Text>
              <Text style={styles.tripInfoValue}>{trip.numMembers}</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Status</Text>
              <Text style={styles.tripInfoValue}></Text>
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
        {groupedItems[activeDay] && (
          <>
            {groupedItems[activeDay].spots.map((spot) => (
              <PressableOpacity key={spot.id} onPress={() => handleSpotDetail(spot.id)}>
                <View style={styles.spotCard}>
                  <View style={styles.spotImageContainer}>
                    <Image source={spot.image} style={styles.spotImage} />
                  </View>
                  <View style={styles.spotDetails}>
                    <Text style={styles.spotName}>{spot.name}</Text>
                    <View style={styles.spotLocationContainer}>
                      <Ionicons name="location-outline" size={14} color={theme.text} style={{ paddingTop: 5 }} />
                      <Text style={styles.spotAddress} numberOfLines={1}>
                        {spot.address}
                      </Text>
                    </View>
                  </View>
                </View>
              </PressableOpacity>
            ))}
          </>
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
      backgroundColor: '#FFFFFF',
    },
    content: {
      flex: 1,
      marginTop: 16,
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
      // padding: 8,
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
      fontSize: FontSize.MD,
      marginBottom: 2,
      color: theme.primary,
      paddingRight: 8,
    },
    spotLocationContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      paddingRight: 20,
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
      margin: 16,
      backgroundColor: 'transparent',
    },
    editButton: {
      backgroundColor: '#3F6453',
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: 'center',
    },
    editButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
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
