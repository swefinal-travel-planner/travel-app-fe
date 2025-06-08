import { Padding, Radius } from '@/constants/theme'
import { Trip } from '@/features/trip/domain/models/Trip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { StyleSheet, Text } from 'react-native'
import { View } from 'react-native-ui-lib'

const blurhash = 'this-is-a-blurhash'

export default function TripCard({ trip }: Readonly<{ trip: Trip }>) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  console.log(trip.imageUrl)
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        placeholder={{ blurhash }}
        source={{ uri: trip.imageUrl }}
      />
      <View style={{ padding: 10 }}>
        <Text>{trip.name}</Text>
        <Text>{trip.location}</Text>
      </View>
    </View>
  )
}
const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: 200,
      borderRadius: Radius.NORMAL,
      overflow: 'hidden',
      backgroundColor: theme.background,
      marginBottom: Padding.NORMAL,
      padding: Padding.NORMAL,
    },
    image: {
      width: '100%',
      height: '70%',
      borderRadius: Radius.NORMAL,
    },
  })
