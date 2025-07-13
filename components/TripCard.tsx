import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
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
      return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD }]}>Still planning...</Text>
    }
    if (status === 'failed') {
      return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD }]}>Failed to plan</Text>
    }
    return <Text style={[styles.statusText, { fontFamily: FontFamily.BOLD }]}>Ready to go!</Text>
  }

  return (
    <View style={styles.container}>
      <PressableOpacity
        style={[styles.wrapper, { backgroundColor: isDisabled ? theme.disabled : theme.secondary }]}
        onPress={onPress}
        disabled={isDisabled}
      >
        {tripImage && tripImage !== '' && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: tripImage }} style={styles.image} contentFit="cover" transition={200} />
          </View>
        )}

        <View style={styles.contentContainer}>
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
        </View>
      </PressableOpacity>
    </View>
  )
}

export default TripCard

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    wrapper: {
      borderRadius: Radius.ROUNDED,
      padding: 16,
      backgroundColor: theme.secondary,
    },
    imageContainer: {
      width: '100%',
      height: 120,
      marginBottom: 12,
      borderRadius: Radius.ROUNDED,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
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
    },
  })
