import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import PressableOpacity from './PressableOpacity'

// Import trip icon assets
const tripIcons = {
  0: require('@/assets/icons/trips/World-pana.svg'),
  1: require('@/assets/icons/trips/World-amico.svg'),
  2: require('@/assets/icons/trips/World-bro.svg'),
  3: require('@/assets/icons/trips/World-rafiki.svg'),
}

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
  onDelete?: () => void
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
  onDelete,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const isDisabled = status === 'ai_generating' || status === 'failed'

  // Get trip icon based on trip ID modulo 4
  const getTripIcon = () => {
    const tripIdNumber = parseInt(tripId, 10) || 0
    const iconIndex = tripIdNumber % 4
    return tripIcons[iconIndex as keyof typeof tripIcons]
  }

  // Get specific styling for each icon if needed
  const getIconStyle = () => {
    const tripIdNumber = parseInt(tripId, 10) || 0
    const iconIndex = tripIdNumber % 4

    // Apply specific styling for World-rafiki (index 3)
    if (iconIndex === 3) {
      return {
        width: 96,
        height: 96,
        marginLeft: -8,
        marginTop: -8,
      }
    }

    return {}
  }

  const handleDelete = () => {
    Alert.alert('Delete trip', `Are you sure you want to delete "${tripName}"? This action cannot be undone.`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ])
  }

  const renderStatusText = () => {
    if (status === 'ai_generating') {
      return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD, opacity: 0.5 }]}>Still planning...</Text>
    }
    if (status === 'failed') {
      return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD }]}>Failed to plan</Text>
    }
    if (status === 'completed') {
      return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD, opacity: 0.5 }]}>Completed</Text>
    }
    if (status == 'in_progress') {
      return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD, color: theme.primary }]}>In progress</Text>
    }
    return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD, color: theme.primary }]}>Ready to go!</Text>
  }

  return (
    <PressableOpacity
      style={[styles.wrapper, { backgroundColor: isDisabled ? theme.disabled : theme.secondary }]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.imageContainer}>
        <Image source={getTripIcon()} style={[styles.image, getIconStyle()]} contentFit="contain" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {tripName}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          {days} days · {num_members} members
        </Text>

        {renderStatusText()}
      </View>

      {onDelete && (
        <PressableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color={theme.primary} />
        </PressableOpacity>
      )}
    </PressableOpacity>
  )
}

export default TripCard

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
      borderRadius: Radius.ROUNDED,
      padding: 16,
      backgroundColor: theme.secondary,
      flex: 1,
      width: '100%',
      flexDirection: 'row',
    },
    imageContainer: {
      height: 80,
      width: 80,
      borderRadius: Radius.ROUNDED,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textContainer: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'center',
    },
    name: {
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      fontSize: 16,
      marginBottom: 4,
    },
    location: {
      color: theme.text,
      fontFamily: FontFamily.REGULAR,
      fontSize: 12,
      marginBottom: 4,
    },
    statusText: {
      color: theme.text,
      fontSize: 12,
    },
    deleteButton: {
      padding: 8,
      borderRadius: Radius.NORMAL,
      justifyContent: 'center',
      height: '100%',
    },
  })
