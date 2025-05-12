import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Stack, Tabs, useLocalSearchParams, useRouter } from 'expo-router'
import { Trip } from '@/lib/types/Trip'
import Ionicons from '@expo/vector-icons/Ionicons'

const sampleTrips: Trip[] = [
  {
    id: '1',
    image:
      'https://lh3.googleusercontent.com/p/AF1QipPwjfXoTp4uuEBODAptmwg054U6pzYeLUhS9W-o=s1360-w1360-h1020',
    title: 'Hà Giang Loop Adventure',
    city: 'Hà Giang',
    start_date: '2025-05-10',
    days: 4,
    budget: 500,
    num_members: 5,
    location_attributes: ['mountains', 'viewpoints'],
    food_attributes: ['local', 'street food'],
    special_requirements: ['helmet', 'raincoat'],
    medical_conditions: [],
    status: 'not_started',
    pinned: true,
  },
  // ...thêm các chuyến đi khác nếu cần
]

export default function TripDetailLayout() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)

  useEffect(() => {
    const foundTrip = sampleTrips.find((trip) => trip.id === id)
    setTrip(foundTrip || null)
  }, [id])

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    )
  }

  return (
    // <View>
    //   {/* Header */}
    //   <View style={styles.header}>
    //     <TouchableOpacity>
    //       <Ionicons name="arrow-back" size={24} color="#000" />
    //     </TouchableOpacity>
    //   </View>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#563D30',
        tabBarInactiveTintColor: '#A68372',
        tabBarPosition: 'top',
        tabBarIcon: () => null,
        tabBarStyle: {
          elevation: 0,
          backgroundColor: '#FFF',
          height: 60,
          borderBottomWidth: 1,
          borderBottomColor: '#A68372',
        },
        tabBarLabelStyle: {
          fontSize: 20,
          textTransform: 'none',
          fontFamily: 'NotoSerif_400Regular',
          //borderBottomWidth: 2,
          //borderBottomColor: '#E5DACB',
        },
      }}
    >
      <Tabs.Screen
        name="details"
        options={{
          title: 'Details',
          tabBarLabel: 'Details',
        }}
      />
      <Tabs.Screen
        name="companions"
        options={{
          title: 'Companions',
          tabBarLabel: 'Companions',
        }}
      />
      <Tabs.Screen
        name="album"
        options={{
          title: 'Album',
          tabBarLabel: 'Album',
        }}
      />
    </Tabs>
    // </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#563D30',
  },
})
