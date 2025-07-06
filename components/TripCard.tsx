import { useMemo } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import PressableOpacity from './PressableOpacity'

type TripCardProps = {
  tripId: string
  tripName: string
  tripImage: string
  days: number
  num_members: number
  budget: number
  isPinned: boolean
  status?: string
  onPress: () => void
}

const TripCard: React.FC<TripCardProps> = ({
  tripId,
  tripName,
  tripImage,
  days,
  num_members,
  budget,
  status,
  isPinned,
  onPress,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <PressableOpacity
      style={[
        styles.wrapper,
        { backgroundColor: status === 'ai_generating' || status === 'failed' ? theme.disabled : theme.secondary },
      ]}
      onPress={onPress}
      disabled={status === 'ai_generating' || status === 'failed'}
    >
      {tripImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: tripImage }} style={styles.image} />
        </View>
      )}

      <View style={[styles.spotInfo]}>
        <Text style={styles.name} numberOfLines={1}>
          {tripName}
        </Text>

        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.location} numberOfLines={1}>
            {days} days · {num_members} members
          </Text>

          {status === 'ai_generating' ? (
            <Text style={[styles.location, { fontFamily: FontFamily.BOLD }]} numberOfLines={1}>
              Still planning...
            </Text>
          ) : status === 'failed' ? (
            <Text style={[styles.location, { fontFamily: FontFamily.BOLD }]} numberOfLines={1}>
              Failed to plan
            </Text>
          ) : null}
        </View>
      </View>
    </PressableOpacity>
  )
}

export default TripCard

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
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
