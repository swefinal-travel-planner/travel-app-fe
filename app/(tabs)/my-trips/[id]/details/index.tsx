import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Trip, TripItem } from '@/lib/types/Trip'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const url = process.env.EXPO_PUBLIC_BE_API_URL

const TripDetailViewScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [trip, setTrip] = useState<Trip>()
  const [tripItems, setTripItems] = useState<TripItem[]>([])
  const [groupedItems, setGroupedItems] = useState<
    { day: number; date: string; spots: any[] }[]
  >([])

  const [activeDay, setActiveDay] = useState(0)
  const router = useRouter()

  const handleEditTrip = () => {
    router.push({
      pathname: `my-trips/${trip?.id}/details/modify`,
      params: {
        tripData: JSON.stringify(groupedItems[activeDay]?.spots ?? []),
        tripDate: groupedItems[activeDay]?.date ?? '',
        tripDay: groupedItems[activeDay]?.day ?? 1,
      },
    })
  }

  const [activeTab, setActiveTab] = useState('Details')

  const { id } = useLocalSearchParams()

  console.log('Trip ID:', id)

  const getTripDetail = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      const response = await fetch(`${url}/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }
      const data = await response.json()
      console.log('Get trip by ID:', data.data)
      setTrip(data.data)
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
      const accessToken = await SecureStore.getItemAsync('accessToken')
      const response = await fetch(`${url}/trips/${id}/trip-items`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch trip items')
      }

      const data = await response.json()
      const items: TripItem[] = data.data
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
                image: { uri: spot.placeInfo?.image?.[0] ?? '' },
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
            {formatDate(new Date(trip.startDate))} -{' '}
            {calculateEndDate(trip.startDate, trip.days)}
          </Text>

          <View style={styles.tripInfoRow}>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Budget</Text>
              <Text style={styles.tripInfoValue}>
                {trip.budget.toLocaleString('vi-VN')}
              </Text>
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
          <TouchableOpacity
            onPress={goToPreviousDay}
            style={styles.dayNavigationButton}
            disabled={activeDay === 0}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={activeDay === 0 ? '#ccc' : '#000'}
            />
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
              color={activeDay === groupedItems.length - 1 ? '#ccc' : '#000'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.mapInstructionText}>
          Tap a spot to view its detail
        </Text>

        {/* Spots List */}
        {groupedItems[activeDay] && (
          <>
            {groupedItems[activeDay].spots.map((spot) => (
              <View key={spot.id} style={styles.spotCard}>
                <View style={styles.spotImageContainer}>
                  <Image source={spot.image} style={styles.spotImage} />
                </View>
                <View style={styles.spotDetails}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <View style={styles.spotLocationContainer}>
                    <Ionicons name="location" size={14} color="#888" />
                    <Text style={styles.spotAddress}>{spot.address}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Edit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditTrip}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 22,
    },
    content: {
      flex: 1,
      marginTop: 16,
    },
    tripCard: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: '#E5DACB',
    },
    destinationText: {
      fontSize: 30,
      textAlign: 'center',
      color: '#563D30',
      marginBottom: 4,
    },
    dateAndCostText: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 12,
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
      fontSize: 12,
      color: '#888',
      marginBottom: 2,
    },
    tripInfoValue: {
      fontSize: 14,
      color: '#333',
    },
    dayNavigationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    dayNavigationButton: {
      padding: 8,
    },
    dayText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '500',
      paddingHorizontal: 16,
      color: '#563D30',
    },
    mapInstructionText: {
      fontSize: 14,
      color: '#563D30',
      textAlign: 'center',
      marginBottom: 16,
    },
    spotCard: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E5DACB',
    },
    spotImageContainer: {
      width: 120,
      height: 80,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spotImage: {
      width: '100%',
      height: '100%',
      borderColor: '#D3B7A8',
      borderWidth: 2,
      borderRadius: 8,
    },
    spotDetails: {
      flex: 1,
      padding: 12,
      justifyContent: 'center',
    },
    spotName: {
      fontSize: 15,
      fontWeight: '500',
      marginBottom: 6,
      color: '#563D30',
    },
    spotLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spotAddress: {
      fontSize: 13,
      color: '#A68372',
      marginLeft: 4,
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
