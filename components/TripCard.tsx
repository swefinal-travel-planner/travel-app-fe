import { useMemo, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import PressableOpacity from './PressableOpacity'

interface TripCardProps {
  tripId: string
  tripName: string
  tripImage: string
  days: number
  num_members: number
  budget: number
  isPinned: boolean
  onPress: () => void
}

const TripCard: React.FC<TripCardProps> = ({
  tripId,
  tripName,
  tripImage,
  days,
  num_members,
  budget,
  isPinned,
  onPress,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [pinned, setPinned] = useState(isPinned)

  return (
    <PressableOpacity style={styles.wrapper} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: tripImage }} style={styles.image} />

        {/* <PressableOpacity style={styles.overlay} onPress={() => setPinned(!pinned)}>
          <Ionicons name={pinned ? 'pin' : 'pin-outline'} size={20} color="white" />
        </PressableOpacity> */}
      </View>

      <View style={styles.spotInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {tripName}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.location} numberOfLines={1}>
            {days} days · {num_members} members
          </Text>
        </View>
      </View>
    </PressableOpacity>
  )
}

export default TripCard

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
      width: 360,
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
    },
    overlay: {
      position: 'absolute',
      top: -112,
      right: 8,
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 6,
      borderRadius: Radius.NORMAL,
      alignItems: 'center',
      justifyContent: 'center',
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
      fontSize: 16,
      clip: 'ellipsis',
      marginTop: 2,
    },
    location: {
      color: theme.text,
      fontFamily: FontFamily.REGULAR,
      fontSize: 12,
      clip: 'ellipsis',
      marginTop: 4,
    },
  })
