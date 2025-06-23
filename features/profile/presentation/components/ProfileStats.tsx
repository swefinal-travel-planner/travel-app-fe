import { colorPalettes } from '@/constants/Itheme'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-ui-lib'

type ProfileStatsProps = {
  theme: typeof colorPalettes.light
  onGoToTrips: () => void
}

const ProfileStats = ({ theme, onGoToTrips }: ProfileStatsProps) => (
  <View style={[styles.statsContainer, { borderColor: theme.background }]}>
    <View style={styles.statsItem}>
      <Text text70>Number of Trips</Text>
      <Text text50BO>70</Text>
      <Button label="Go to My trips" backgroundColor={theme.primary} onPress={onGoToTrips} />
    </View>
    <View style={[styles.statsItem, { borderRightColor: theme.background }]}>
      <Text text70>Completed Trips</Text>
      <Text text50BO>50</Text>
      <Button label="View Trip history" backgroundColor={theme.primary} />
    </View>
  </View>
)

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
