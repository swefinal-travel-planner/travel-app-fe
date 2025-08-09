import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Trip } from '@/lib/types/Trip'
import { calculateEndDate, formatDate } from '@/utils/Datetime'
import { formatTripStatus } from '@/utils/tripAttributes'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PressableOpacity from './PressableOpacity'

interface TripInfoCardProps {
  trip: Trip
}

const TripInfoCard: React.FC<TripInfoCardProps> = ({ trip }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()

  const handleTripVisualization = () => {
    router.push(`/visualize-trip/${trip.id}`)
  }

  return (
    <View style={styles.tripCard}>
      <View style={styles.tripCardHeader}>
        <View>
          <Text style={styles.destinationText}>{trip.title}</Text>
          <Text style={styles.dateAndCostText}>
            {formatDate(new Date(trip.startDate))} - {calculateEndDate(trip.startDate, trip.days)}
          </Text>
        </View>
        <PressableOpacity onPress={handleTripVisualization}>
          <Text style={styles.visualizeButton}>
            <Ionicons name="map-outline" size={24} color={theme.white} />
          </Text>
        </PressableOpacity>
      </View>

      <View style={styles.tripInfoRow}>
        <View style={styles.tripInfoItem}>
          <Text style={styles.tripInfoLabel}>Location</Text>
          <Text style={styles.tripInfoValue}>{trip.city}</Text>
        </View>
        <View style={styles.tripInfoItem}>
          <Text style={styles.tripInfoLabel}>Members</Text>
          <Text style={styles.tripInfoValue}>{trip.memberCount}</Text>
        </View>
        <View style={styles.tripInfoItem}>
          <Text style={styles.tripInfoLabel}>Status</Text>
          <Text style={styles.tripInfoValue}>{formatTripStatus(trip.status)}</Text>
        </View>
      </View>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    tripCard: {
      backgroundColor: theme.secondary,
      borderRadius: Radius.ROUNDED,
      padding: 16,
      marginBottom: 10,
      marginHorizontal: 24,
    },
    tripCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    visualizeButton: {
      color: theme.white,
      backgroundColor: theme.primary,
      padding: 8,
      borderRadius: Radius.FULL,
    },
    destinationText: {
      fontSize: FontSize.XXXL,
      color: theme.primary,
      marginBottom: 4,
      fontFamily: FontFamily.BOLD,
    },
    dateAndCostText: {
      marginBottom: 12,
      fontSize: FontSize.MD,
      color: theme.primary,
      fontFamily: FontFamily.REGULAR,
    },
    tripInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    tripInfoItem: {
      alignItems: 'center',
      flex: 1,
    },
    tripInfoLabel: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      marginBottom: 2,
      textAlign: 'left',
      alignSelf: 'stretch',
      marginRight: 8,
    },
    tripInfoValue: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      alignSelf: 'stretch',
      marginRight: 8,
    },
  })

export default TripInfoCard
