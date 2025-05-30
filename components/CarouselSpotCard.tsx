import { Image, StyleSheet, Text, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { useMemo } from 'react'
import Pressable from './Pressable'
import PressableOpacity from './PressableOpacity'

interface SpotCardProps {
  spotName: string
  spotLocation: string
  spotImage: string
  onCheckIn?: () => void
}

const CarouselSpotCard: React.FC<SpotCardProps> = ({
  spotName,
  spotLocation,
  spotImage,
  onCheckIn,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <PressableOpacity style={styles.wrapper}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: spotImage }} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.spotInfo}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {spotName}
          </Text>

          <View style={styles.locationContainer}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#A68372"
              style={{ marginRight: 4 }}
            />

            <Text
              style={styles.location}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {spotLocation}
            </Text>
          </View>
        </View>

        <Pressable title={'Check in'} onPress={onCheckIn} />
      </View>
    </PressableOpacity>
  )
}

export default CarouselSpotCard

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      height: 206,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      width: '100%',
      height: 120,
      marginBottom: 8,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      borderColor: '#A68372',
    },
    infoContainer: {
      width: '100%',
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    spotInfo: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginBottom: 8,
      marginRight: 8,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    name: {
      color: '#563D30',
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 16,
      width: '100%',
      marginTop: 2,
    },
    location: {
      color: '#A68372',
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 12,
      flex: 1,
      marginTop: 4,
    },
  })
