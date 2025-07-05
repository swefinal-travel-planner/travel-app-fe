import CreateTripButton from '@/components/Buttons/CreateTripButton'
import TripCard from '@/components/TripCard'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { Trip } from '@/lib/types/Trip'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function MyTrips() {
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [trips, setTrips] = useState<Trip[]>([])
  const [search, setSearch] = useState('')
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(trips)

  const getAllTrips = async () => {
    try {
      const response = await beApi.get('/trips')
      const sortedTrips = response.data.data.sort((a: Trip, b: Trip) => Number(b.id) - Number(a.id))
      setTrips(sortedTrips)
      setFilteredTrips(sortedTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await getAllTrips()
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    getAllTrips()
  }, [])

  // Filter trips based on search query
  useEffect(() => {
    if (!search.trim()) {
      setFilteredTrips(trips)
    } else {
      const filtered = trips.filter((trip) => trip.title.toLowerCase().includes(search.toLowerCase()))
      setFilteredTrips(filtered)
    }
  }, [search, trips])

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.background }]}>
          <Ionicons name="search" size={20} color={theme.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search for your trips"
            placeholderTextColor={theme.dimText}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.dimText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Danh sách chuyến đi */}
      {filteredTrips.length <= 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>There are no trips to display. Plan one?</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTrips}
          renderItem={({ item }) => (
            <TripCard
              tripId={item.id}
              tripName={item.title}
              tripImage={item.image?.[0] || ''}
              days={item.days}
              num_members={item.memberCount}
              budget={item.budget}
              isPinned={item.pinned}
              status={item.status}
              onPress={() => router.push(`/my-trips/${item.id}/details` as const)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
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
    searchContainer: {
      width: '100%',
      paddingVertical: 16,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.background,
      borderRadius: Radius.FULL,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
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
