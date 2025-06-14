import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface Location {
  long: number
  lat: number
}

interface SpotData {
  id: string
  location: Location
  name: string
  properties: string[]
  type: string[]
  image: string
  isSaved: boolean
}

import Pressable from '@/components/Pressable'
import SpotCard from '@/components/SpotCards/SpotCard'

import CarouselSpotCard from '@/components/SpotCards/CarouselSpotCard'
import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { useMemo } from 'react'
import { Carousel } from 'react-native-ui-lib'

const hasTrip = true
const EXPO_PUBLIC_CORE_API_URL = process.env.EXPO_PUBLIC_CORE_API_URL

// get screen width for responsive sizing
const { width: screenWidth } = Dimensions.get('window')
const cardWidth = screenWidth - 120 // account for margins and padding

const Index = () => {
  const [coolSpots, setCoolSpots] = useState<SpotData[]>([])
  const data: SpotData[] = [
    {
      id: '1',
      location: { long: 106.700981, lat: 10.776889 },
      name: 'Ben Thanh Market',
      properties: ['local food', 'souvenir', 'historic'],
      type: ['market', 'cultural'],
      image: 'https://example.com/images/ben-thanh.jpg',
      isSaved: true,
    },
    {
      id: '2',
      location: { long: 106.703394, lat: 10.775659 },
      name: 'Notre-Dame Cathedral',
      properties: ['architecture', 'historic', 'landmark'],
      type: ['church', 'tourist'],
      image: 'https://example.com/images/notre-dame.jpg',
      isSaved: false,
    },
    {
      id: '3',
      location: { long: 106.695831, lat: 10.762622 },
      name: 'War Remnants Museum',
      properties: ['history', 'museum', 'education'],
      type: ['museum'],
      image: 'https://example.com/images/war-museum.jpg',
      isSaved: true,
    },
    {
      id: '4',
      location: { long: 106.706291, lat: 10.782636 },
      name: 'Saigon Zoo and Botanical Gardens',
      properties: ['nature', 'family-friendly', 'animals'],
      type: ['zoo', 'garden'],
      image: 'https://example.com/images/zoo-garden.jpg',
      isSaved: false,
    },
    {
      id: '5',
      location: { long: 106.711632, lat: 10.762913 },
      name: 'Landmark 81',
      properties: ['modern', 'viewpoint', 'shopping'],
      type: ['skyscraper', 'mall'],
      image: 'https://example.com/images/landmark81.jpg',
      isSaved: true,
    },
  ]

  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()

  const getCoolSpots = async () => {
    try {
      const limit = 5
      const language = 'en' // hoặc 'vi'

      const query = new URLSearchParams({
        limit: limit.toString(),
        language,
      }).toString()

      const response = await fetch(
        `${EXPO_PUBLIC_CORE_API_URL}/places/get_random_places?${query}`
      )
      const data = await response.json()
      console.log('Fetched cool spots:', data.data[0])
      setCoolSpots(data.data)
    } catch (error) {
      console.error('Error fetching cool spots:', error)
    }
  }

  useEffect(() => {
    getCoolSpots()
  }, [])

  const getTypes = async () => {
    try {
      const language = 'en' // hoặc 'vi'
      const query = new URLSearchParams({
        language,
      }).toString()

      const response = await fetch(
        `${EXPO_PUBLIC_CORE_API_URL}/labels?${query}`
      )
      const data = await response.json()
      console.log('Fetched types:', data)
    } catch (error) {
      console.error('Error fetching cool spots:', error)
    }
  }

  useEffect(() => {
    getTypes()
  }, [])

  const handlePress = (item: SpotData) => {
    router.push({
      pathname: `/places/${item.id}`,
      params: {
        name: item.name,
        long: item.location.long.toString(),
        lat: item.location.lat.toString(),
        properties: item.properties.join(','),
        types: item.type,
        image: item.image,
      },
    })
  }
  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.topCenter}>
          <Text style={styles.hugeText}>Welcome back, bro!</Text>

          <Link href="/signup/allergies" style={styles.mainButton}>
            Go to Signup screen
          </Link>

          {hasTrip ? (
            <View style={styles.currentTrip}>
              <Text style={styles.subText}>This morning's plan</Text>
              <Text style={styles.mainText}>Ho Chi Minh City</Text>

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
                {data.map((item, index) => (
                  <CarouselSpotCard key={index} {...item} />
                ))}
              </Carousel>

              <Pressable
                title={'View trip details'}
                style={styles.button}
              ></Pressable>
            </View>
          ) : (
            <View style={styles.currentTrip}>
              <Text style={styles.mainText}>Your next great trip awaits!</Text>

              <Pressable
                title={'Plan a new trip'}
                style={styles.button}
              ></Pressable>
            </View>
          )}
        </View>

        <Text style={[styles.mainText, styles.mainText]}>
          Cool spots near you
        </Text>

        <FlatList
          horizontal={true}
          style={[styles.list, { marginBottom: 28 }]}
          contentContainerStyle={styles.listContent}
          data={coolSpots}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <SpotCard {...item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={[styles.mainText, styles.mainText]}>
          Spots you've visited
        </Text>

        <FlatList
          horizontal={true}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <SpotCard {...item} />
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
