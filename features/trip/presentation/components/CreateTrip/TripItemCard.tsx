import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TypedTripItem } from './DayPlanner'

export type TripItemCardProps = {
  item: TypedTripItem
  drag: () => void
  isActive: boolean
}

export const TripItemCard: React.FC<TripItemCardProps> = ({ item, drag, isActive }) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={drag}
        disabled={isActive}
        style={[styles.spotCard, { backgroundColor: isActive ? '#f0f0f0' : '#ffffff' }]}
      >
        <View style={styles.dragHandle}>
          <Ionicons name="menu-outline" size={24} color="#666" />
        </View>

        <View style={styles.spotImageContainer}>
          <Image
            source={{
              uri: item.place?.images[0],
            }}
            style={styles.spotImage}
          />
        </View>

        <View style={styles.spotDetails}>
          <Text style={styles.spotName}>{item.place?.name}</Text>
          <View style={styles.spotLocationContainer}>
            <Ionicons name="location" size={14} color="#888" />
            <Text numberOfLines={1}>{item.place?.address ?? 'No address available'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  )
}

const styles = StyleSheet.create({
  spotCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5DACB',
    alignItems: 'center',
  },
  dragHandle: {
    marginHorizontal: 8,
  },
  spotImageContainer: {
    width: 100,
    height: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotImage: {
    width: '100%',
    height: '100%',
    borderColor: '#D3B7A8',
    borderWidth: 2,
    borderRadius: 8,
  },
  spotDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  spotName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#563D30',
  },
  spotLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
