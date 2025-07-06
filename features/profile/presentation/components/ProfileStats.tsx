import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type ProfileStatsProps = {
  onGoToTrips: () => void
}

const ProfileStats = ({ onGoToTrips }: ProfileStatsProps) => {
  const [numTrips, setNumTrips] = useState(0)
  const [numCompletedTrips, setNumCompletedTrips] = useState(0)

  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const getAllTrips = async () => {
    try {
      const response = await beApi.get('/trips')
      setNumTrips(response.data.data.length)
      const completedTrips = response.data.data.filter((trip: any) => trip.status === 'completed')
      setNumCompletedTrips(completedTrips.length)
    } catch (error) {
      console.log('Profile stats fetch trips failed:', error)
      throw error
    }
  }

  useEffect(() => {
    getAllTrips()
  }, [])

  return (
    <View style={[styles.statsContainer]}>
      <View style={[styles.statsGroup]}>
        <View style={styles.statsItem}>
          <Text style={styles.statsHeader}>Number of trips</Text>
          <Text style={styles.statsValue}>{numTrips}</Text>
        </View>
        <View style={[styles.statsItem, { borderRightColor: theme.background }]}>
          <Text style={styles.statsHeader}>Completed trips</Text>
          <Text style={styles.statsValue}>{numCompletedTrips}</Text>
        </View>
      </View>

      <Pressable
        title="See my trips"
        style={{ backgroundColor: theme.primary, color: theme.white }}
        onPress={onGoToTrips}
      />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    statsContainer: {
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 25,
      paddingVertical: 10,
      flexDirection: 'column',
      backgroundColor: theme.secondary,
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    statsGroup: {
      flexDirection: 'row',
    },
    statsItem: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    statsHeader: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
    },
    statsValue: {
      fontSize: FontSize.XXXL,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      marginBottom: 10,
    },
  })

export default ProfileStats
