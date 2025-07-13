import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Trip } from '@/lib/types/Trip'
import { calculateEndDate, formatDate } from '@/utils/Datetime'
import { formatTripStatus } from '@/utils/tripAttributes'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface TripInfoCardProps {
  trip: Trip
}

const TripInfoCard: React.FC<TripInfoCardProps> = ({ trip }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.tripCard}>
      <Text style={styles.destinationText}>{trip.title}</Text>
      <Text style={styles.dateAndCostText}>
        {formatDate(new Date(trip.startDate))} - {calculateEndDate(trip.startDate, trip.days)}
      </Text>

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
    destinationText: {
      fontSize: FontSize.XXXL,
      textAlign: 'center',
      color: theme.primary,
      marginBottom: 4,
      fontFamily: FontFamily.BOLD,
    },
    dateAndCostText: {
      textAlign: 'center',
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
    },
    tripInfoValue: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
    },
  })

export default TripInfoCard
