import { SpotData } from '@/lib/types/Spots'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Pressable from '@/components/Pressable'
import SpotCard from '@/components/SpotCards/SpotCard'

import CarouselSpotCard from '@/components/SpotCards/CarouselSpotCard'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi, { safeBeApiCall } from '@/lib/beApi'
import { Trip, TripItem } from '@/lib/types/Trip'
import { useMemo } from 'react'
import { Carousel } from 'react-native-ui-lib'

const EXPO_PUBLIC_CORE_API_URL = process.env.EXPO_PUBLIC_CORE_API_URL

// get screen width for responsive sizing
const { width: screenWidth } = Dimensions.get('window')
const cardWidth = screenWidth - 120 // account for margins and padding

const Index = () => {
  const [coolSpots, setCoolSpots] = useState<SpotData[]>([])
  const [topPicks, setTopPicks] = useState<SpotData[]>([])
  const [username, setUsername] = useState('')
  const [ongoingTrip, setOngoingTrip] = useState<Trip | null>(null)
  const [ongoingTripItems, setOngoingTripItems] = useState<TripItem[]>([])
  const [tripDay, setTripDay] = useState(1)

  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()

  const getSpots = async () => {
    try {
      const limit = 10
      const language = 'en' // hoặc 'vi'

      const query = new URLSearchParams({
        limit: limit.toString(),
        language,
      }).toString()

      const response = await fetch(`${EXPO_PUBLIC_CORE_API_URL}/places/get_random_places?${query}`)
      const data = await response.json()

      const places: SpotData[] = data.data
      const firstHalf = places.slice(0, 5)
      const secondHalf = places.slice(5, 10)

      setCoolSpots(firstHalf)
      setTopPicks(secondHalf)
    } catch (error) {
      console.error('Error fetching cool spots:', error)
    }
  }

  const getOngoingTrip = async () => {
    try {
      const response = await safeBeApiCall(() => beApi.get('/trips'))
      const ongoingTrip = response.data.data.filter((trip: Trip) => trip.status === 'in_progress')[0]

      if (!ongoingTrip) {
        console.warn('No ongoing trip found')
        setOngoingTrip(null)
        setOngoingTripItems([])
        return
      }

      setOngoingTrip(ongoingTrip)

      const tripItemData = await safeBeApiCall(() => beApi.get(`/trips/${ongoingTrip.id}/trip-items?language=en`))

      // Check if the response data is null or undefined
      if (!tripItemData.data?.data) {
        console.warn('No trip items data received from API')
        return
      }

      let items: TripItem[] = tripItemData.data.data

      // Check if items array is empty
      if (!items || items.length === 0) {
        console.warn('No trip items found')
        return
      }

      const dayInTrip = new Date().getDay() - new Date(ongoingTrip.startDate).getDay() + 1
      setTripDay(dayInTrip)

      items = items.filter((item: TripItem) => item.tripDay === dayInTrip)

      setOngoingTripItems(items)
    } catch (error) {
      console.error('Error fetching ongoing trips:', error)
    }
  }

  const getUsername = async () => {
    let name = await SecureStore.getItemAsync('name')

    if (name) {
      const firstName = name.split(' ')[0]
      setUsername(`, ${firstName}`)
    } else {
      setUsername('')
    }
  }

  useEffect(() => {
    getSpots()
    getOngoingTrip()
    getUsername()
  }, [])

  const handlePress = (item: SpotData) => {
    router.push({
      pathname: '/places/[id]',
      params: {
        id: item.id,
        name: item.name,
        lng: item.location.long.toString(),
        lat: item.location.lat.toString(),
        properties: item.properties.join(' '),
        address: item.address,
        types: item.type,
        images: JSON.stringify(item.images),
        status: null,
        tripId: null,
        tripItemId: null,
      },
    })
  }

  const handleCreateTrip = () => {
    router.push('/my-trips/welcome-create')
  }

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.topCenter}>
          <Text style={styles.hugeText}>Welcome back{username}!</Text>

          {ongoingTrip ? (
            <View style={styles.currentTrip}>
              <Text style={styles.subText}>Today's plan</Text>
              <Text style={styles.mainText}>
                {ongoingTrip.title} (day {tripDay})
              </Text>

              <Carousel
                pagingEnabled
                containerPaddingVertical={8}
                initialPage={0}
                containerStyle={{
                  width: cardWidth,
                  height: 240,
                }}
                containerMarginHorizontal={0}
                pageControlPosition={Carousel.pageControlPositions.UNDER}
                pageControlProps={{ color: theme.primary }}
              >
                {ongoingTripItems.map((item, index) => (
                  <CarouselSpotCard key={index} tripItem={item} />
                ))}
              </Carousel>

              <Pressable
                title={'View trip details'}
                style={styles.button}
                onPress={() => router.push(`/my-trips/${ongoingTrip.id}/details` as const)}
              ></Pressable>
            </View>
          ) : (
            <View style={styles.currentTrip}>
              <Text style={styles.mainText}>Your next great trip awaits!</Text>

              <Pressable title={'Plan a new trip'} style={styles.button} onPress={handleCreateTrip}></Pressable>
            </View>
          )}
        </View>

        <Text style={[styles.mainText, styles.mainText]}>Cool spots near you</Text>

        <FlatList
          horizontal={true}
          style={[styles.list, { marginBottom: 28 }]}
          contentContainerStyle={styles.listContent}
          data={coolSpots}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <SpotCard name={item.name} image={item.images[0] || ''} isSaved={item.isSaved} address={item.address} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={[styles.mainText, styles.mainText]}>Top picks for you</Text>

        <FlatList
          horizontal={true}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={topPicks}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <SpotCard name={item.name} image={item.images[0] || ''} isSaved={item.isSaved} address={item.address} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  )
}

export default Index

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.white,
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    mainButton: {
      fontSize: FontSize.XXL,
      fontFamily: FontFamily.REGULAR,
      textDecorationLine: 'underline',
      color: theme.text,
    },
    container: {
      alignItems: 'flex-start',
      width: '100%',
    },
    scrollContent: {
      flexGrow: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingBottom: 80,
    },
    list: {
      flexGrow: 0,
      marginHorizontal: -40,
    },
    listContent: {
      paddingHorizontal: 40,
    },
    subText: {
      fontSize: FontSize.LG,
      color: theme.text,
      fontFamily: FontFamily.REGULAR,
    },
    mainText: {
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.XXL,
      marginBottom: 12,
    },
    hugeText: {
      fontSize: FontSize.XXXL,
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
    },
    topCenter: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    currentTrip: {
      width: '100%',
      borderRadius: Radius.ROUNDED,
      marginVertical: 24,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
    },
    button: {
      marginTop: 16,
      backgroundColor: theme.primary,
      color: theme.white,
    },
  })
