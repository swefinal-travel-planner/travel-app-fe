import CreateTripButton from '@/components/Buttons/CreateTripButton'
import CustomTextField from '@/components/input/CustomTextField'
import TripCard from '@/components/TripCard'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { Trip } from '@/lib/types/Trip'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

const url = process.env.EXPO_PUBLIC_BE_API_URL

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [search, setSearch] = useState('')
  const router = useRouter()
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(trips)

  const getAllTrips = async () => {
    try {
      const response = await beApi.get('/trips')
      setTrips(response.data.data)
      setFilteredTrips(response.data.data)
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const handleCreateTrip = () => {
    router.push('/my-trips/welcome-create')
  }

  useEffect(() => {
    getAllTrips()
  }, [])

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <CustomTextField placeholder="Search for your trips..." value={search} onChange={setSearch} />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Danh sách chuyến đi */}
      {filteredTrips.length <= 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>Your next great trip awaits!</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={({ item }) => (
            <TripCard
              tripId={item.id}
              tripName={item.title}
              days={item.days}
              num_members={item.numMembers}
              budget={item.budget}
              isPinned={item.pinned}
              onPress={() => router.push(`/my-trips/${item.id}/details` as const)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {/* Nút tạo chuyến đi */}
      <CreateTripButton onPress={() => router.push('/my-trips/welcome-create')} color={colorPalettes.light.primary} />
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
      paddingHorizontal: 24,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
    },
    divider: {
      height: 1,
      width: '90%',
      alignSelf: 'center',
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 32,
    },
    emptyContainer: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      marginBottom: 16,
    },
    button: {
      marginTop: 16,
      backgroundColor: theme.primary,
      color: theme.white,
    },
  })
