import { Link } from 'expo-router'
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import CarouselSpotCard from '@/components/CarouselSpotCard'
import Pressable from '@/components/Pressable'
import SpotCard from '@/components/SpotCard'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { useMemo } from 'react'
import { Carousel } from 'react-native-ui-lib'

const data = [
  {
    spotName: 'War Remnants Museum',
    spotLocation: '28 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh',
    spotImage:
      'https://lh3.googleusercontent.com/p/AF1QipPwjfXoTp4uuEBODAptmwg054U6pzYeLUhS9W-o=s1360-w1360-h1020',
    isSaved: false,
  },
  {
    spotName: 'Le Quy Don High School',
    spotLocation: '110 Nguyễn Thị Minh Khai, Phường 6, Quận 3, Hồ Chí Minh',
    spotImage:
      'https://lh5.googleusercontent.com/p/AF1QipMtzP5eSZmnAm8xzqo4yvC6dqgALsMgj33CZXWu=w408-h725-k-no',
    isSaved: false,
  },
  {
    spotName: 'Co.opmart Nguyễn Đình Chiểu',
    spotLocation: '168 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh',
    spotImage:
      'https://lh5.googleusercontent.com/p/AF1QipOYQjPY1L6dzxJYj7t-eTSl8_5FyGWdFwsri3d8=w408-h306-k-no',
    isSaved: false,
  },
  {
    spotName: 'HCMC Cultural Palace for Labors',
    spotLocation:
      '55B Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, Hồ Chí Minh',
    spotImage:
      'https://lh5.googleusercontent.com/p/AF1QipPqWjKxgEF2SvrpljDjKqR6-u2tfItMBpUzjOT5=w408-h725-k-no',
    isSaved: false,
  },
]

const hasTrip = true

// get screen width for responsive sizing
const { width: screenWidth } = Dimensions.get('window')
const cardWidth = screenWidth - 120 // account for margins and padding

const Index = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.topCenter}>
          <Text style={styles.hugeText}>Welcome back, bro!</Text>

          <Link href="/signup" style={styles.mainButton}>
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
                pageControlProps={{ color: '#A68372' }}
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
          data={data}
          renderItem={({ item }) => <SpotCard {...item} />}
          keyExtractor={(item) => item.spotName}
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
          renderItem={({ item }) => <SpotCard {...item} />}
          keyExtractor={(item) => item.spotName}
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
      fontSize: 20,
      fontFamily: 'PlusJakartaSans_400Regular',
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
      fontSize: 16,
      marginBottom: 4,
      color: theme.text,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    mainText: {
      fontSize: 20,
      color: theme.primary,
      fontFamily: 'PlusJakartaSans_400Regular',
      marginBottom: 12,
    },
    hugeText: {
      fontSize: 28,
      color: theme.primary,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    topCenter: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    currentTrip: {
      width: '100%',
      borderRadius: 12,
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
