import CreateTripButton from '@/components/Buttons/CreateTripButton'
import TripCard from '@/components/TripCard'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Trip } from '@/lib/types/Trip'
import { colorPalettes } from '@/styles/Itheme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

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
  {
    id: '2',
    image:
      'https://lh3.googleusercontent.com/p/AF1QipPwjfXoTp4uuEBODAptmwg054U6pzYeLUhS9W-o=s1360-w1360-h1020',
    title: 'Đà Lạt Chill Trip',
    city: 'Đà Lạt',
    start_date: '2025-06-01',
    days: 3,
    budget: 300,
    num_members: 3,
    location_attributes: ['lake', 'market'],
    food_attributes: ['vegetarian', 'coffee'],
    special_requirements: ['jacket'],
    medical_conditions: ['asthma'],
    status: 'in_progress',
    pinned: false,
  },
  {
    id: '3',
    image:
      'https://lh3.googleusercontent.com/p/AF1QipPwjfXoTp4uuEBODAptmwg054U6pzYeLUhS9W-o=s1360-w1360-h1020',
    title: 'Nha Trang Beach Break',
    city: 'Nha Trang',
    start_date: '2025-07-15',
    days: 5,
    budget: 700,
    num_members: 4,
    location_attributes: ['beach', 'resort'],
    food_attributes: ['seafood'],
    special_requirements: [],
    medical_conditions: [],
    status: 'completed',
    pinned: true,
  },
  {
    id: '4',
    image:
      'https://lh3.googleusercontent.com/p/AF1QipPwjfXoTp4uuEBODAptmwg054U6pzYeLUhS9W-o=s1360-w1360-h1020',
    title: 'Nha Trang Beach Break',
    city: 'Nha Trang',
    start_date: '2025-07-15',
    days: 5,
    budget: 700,
    num_members: 4,
    location_attributes: ['beach', 'resort'],
    food_attributes: ['seafood'],
    special_requirements: [],
    medical_conditions: [],
    status: 'completed',
    pinned: true,
  },
  {
    id: '5',
    image:
      'https://lh3.googleusercontent.com/p/AF1QipPwjfXoTp4uuEBODAptmwg054U6pzYeLUhS9W-o=s1360-w1360-h1020',
    title: 'Nha Trang Beach Break',
    city: 'Nha Trang',
    start_date: '2025-07-15',
    days: 5,
    budget: 700,
    num_members: 4,
    location_attributes: ['beach', 'resort'],
    food_attributes: ['seafood'],
    special_requirements: [],
    medical_conditions: [],
    status: 'completed',
    pinned: true,
  },
]

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>(sampleTrips)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const filteredTrips = trips.filter((trip) =>
    trip.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#A68372"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for your trips..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#CDB8A5"
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Danh sách chuyến đi */}
      {filteredTrips.length <= 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>Bạn chưa có chuyến đi nào.</Text>
          <Button title="Tạo chuyến đi" />
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={({ item }) => (
            <TripCard
              tripId={item.id}
              tripName={item.title}
              tripImage={item.image}
              days={item.days}
              num_members={item.num_members}
              budget={item.budget}
              isPinned={item.pinned}
              onPress={() =>
                router.push(`/my-trips/${item.id}/details` as const)
              }
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        />
      )}
      {/* Nút tạo chuyến đi */}
      <CreateTripButton
        onPress={() => router.push('/my-trips/welcome-create')}
        color={colorPalettes.light.primary}
      />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: theme.white,
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FCF4E8',
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginBottom: 16,
      width: 360,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.normal,
    },
    divider: {
      height: 1,
      backgroundColor: '#E5DACB',
      width: '90%',
      alignSelf: 'center',
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 32,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 40,
    },
    message: {
      fontSize: 16,
      marginBottom: 16,
    },
  })
