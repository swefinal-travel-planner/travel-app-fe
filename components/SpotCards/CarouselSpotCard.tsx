import { Image, StyleSheet, Text, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { TripItem } from '@/lib/types/Trip'
import { useMemo } from 'react'
import PressableOpacity from '../PressableOpacity'

interface Location {
  long: number
  lat: number
}

interface SpotCardProps {
  tripItem?: TripItem
  onCheckIn?: () => void
}

const CarouselSpotCard: React.FC<SpotCardProps> = ({ tripItem, onCheckIn }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <PressableOpacity style={styles.wrapper}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: tripItem?.placeInfo.images[0] }} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.spotInfo}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {tripItem?.placeInfo?.name || 'Unknown Spot'}
          </Text>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={theme.text} style={{ marginRight: 4 }} />

            <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
              {tripItem?.placeInfo?.address || 'Unknown Location'}
            </Text>
          </View>
        </View>
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
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.MD,
      width: '100%',
      marginTop: 2,
      marginBottom: 4,
    },
    location: {
      color: theme.text,
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.SM,
      flex: 1,
    },
  })
