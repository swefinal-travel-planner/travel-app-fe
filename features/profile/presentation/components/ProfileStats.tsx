import { colorPalettes } from '@/constants/Itheme'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-ui-lib'

const url = process.env.EXPO_PUBLIC_BE_API_URL

type ProfileStatsProps = {
  theme: typeof colorPalettes.light
  onGoToTrips: () => void
}

const ProfileStats = ({ theme, onGoToTrips }: ProfileStatsProps) => {
  const [numTrips, setNumTrips] = useState(0)
  const [numCompletedTrips, setNumCompletedTrips] = useState(0)

  const getAllTrips = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      const response = await fetch(`${url}/trips`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setNumTrips(data.data.length)
      const completedTrips = data.data.filter((trip: any) => trip.status === 'completed')
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
    <View style={[styles.statsContainer, { borderColor: theme.background }]}>
      <View style={styles.statsItem}>
        <Text text70>Number of Trips</Text>
        <Text text50BO>{numTrips}</Text>
        <Button label="Go to My trips" backgroundColor={theme.primary} onPress={onGoToTrips} />
      </View>
      <View style={[styles.statsItem, { borderRightColor: theme.background }]}>
        <Text text70>Completed Trips</Text>
        <Text text50BO>{numCompletedTrips}</Text>
        <Button label="View Trip history" backgroundColor={theme.primary} onPress={onGoToTrips} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  statsContainer: {
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 25,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  statsItem: {
    borderRightWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
})

export default ProfileStats
