import { SpotData } from '@/lib/types/Spots'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Pressable from '@/components/Pressable'
import SpotCard from '@/components/SpotCards/SpotCard'

import CarouselSpotCard from '@/components/SpotCards/CarouselSpotCard'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useMemo } from 'react'
import { Carousel } from 'react-native-ui-lib'

const hasTrip = false
const EXPO_PUBLIC_CORE_API_URL = process.env.EXPO_PUBLIC_CORE_API_URL

// get screen width for responsive sizing
const { width: screenWidth } = Dimensions.get('window')
const cardWidth = screenWidth - 120 // account for margins and padding

const Index = () => {
  const [coolSpots, setCoolSpots] = useState<SpotData[]>([])
  const [topPicks, setTopPicks] = useState<SpotData[]>([])
  const data: SpotData[] = [
    {
      id: '51a6f6d84c74ac5a40592e1d5958ed882540f00103f901d97455fb000000009203244e68c3a02048c3a174202248c3a06e67204b68c3b46e67204de1baab752048e1baa16d22',
      location: { long: 106.700981, lat: 10.776889 },
      name: 'Ben Thanh Market',
      properties: ['local food', 'souvenir', 'historic'],
      type: ['market', 'cultural'],
      images: [
        'https://ae01.alicdn.com/kf/Sa0e264bfabba4dfcaaf7ff704b30bc79A.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/61XFZmy58tL.jpg',
        'https://ae01.alicdn.com/kf/S474b1e228c524878a5f23ab383a22c63P.jpg',
      ],
      isSaved: true,
      address:
        'The Flanker Aviation theater, 30, Tran Hung Dao, Quarter 9, Ben Thanh Ward, Ho Chi Minh City, 71010, Vietnam, Vietnam',
    },
  ]

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

  useEffect(() => {
    getSpots()
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
          <Text style={styles.hugeText}>Welcome back, bro!</Text>

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

              <Pressable title={'View trip details'} style={styles.button}></Pressable>
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
              <SpotCard
                id={item.id}
                address={item.address}
                name={item.name}
                properties={item.properties}
                type={item.type}
                image={item.images[0] || ''}
                isSaved={item.isSaved}
              />
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
              <SpotCard
                id={item.id}
                address={item.address}
                name={item.name}
                properties={item.properties}
                type={item.type}
                image={item.images[0] || ''}
                isSaved={item.isSaved}
              />
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
