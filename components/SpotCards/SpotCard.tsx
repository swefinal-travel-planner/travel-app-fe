import { useMemo, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'

import { useRouter } from 'expo-router'
import PressableOpacity from '../PressableOpacity'
interface Location {
  long: number
  lat: number
}

interface SpotCardProps {
  id: string
  location: Location
  name: string
  properties: string[]
  type: string[]
  image: string
  isSaved: boolean
}

const SpotCard: React.FC<SpotCardProps> = ({
  id,
  location,
  name,
  properties,
  type,
  image,
  isSaved,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [saved, setSaved] = useState(isSaved)
  const router = useRouter()

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />

        <PressableOpacity
          style={styles.overlay}
          onPress={() => setSaved(!saved)}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color="white"
          />
        </PressableOpacity>
      </View>

      <View style={styles.spotInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.text}
            style={{ marginRight: 4 }}
          />

          <Text style={styles.location} numberOfLines={1}>
            {location.long}, {location.lat}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default SpotCard

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
      width: 256,
      height: 206,
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: Radius.ROUNDED,
      padding: 16,
      backgroundColor: theme.secondary,
    },
    imageContainer: {
      width: '100%',
      height: 120,
      position: 'relative',
      marginBottom: 8,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.ROUNDED,
      position: 'absolute',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 6,
      borderRadius: Radius.NORMAL,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8,
    },
    spotInfo: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    name: {
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.MD,
      marginTop: 2,
      marginBottom: 4,
    },
    location: {
      color: theme.text,
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.SM,
    },
  })
