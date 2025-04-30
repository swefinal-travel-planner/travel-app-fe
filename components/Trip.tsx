import { ITrip } from '@/types/Trip/Trip'
import React from 'react'
import { View } from 'react-native-ui-lib'
import { Image } from 'expo-image'

export default function Trip({ trip }: Readonly<{ trip: ITrip }>) {
  console.log(trip.imageUrl)
  return (
    <View style={{ backgroundColor: 'green', flex: 1 }}>
      <Image source={trip.imageUrl} />
    </View>
  )
}
