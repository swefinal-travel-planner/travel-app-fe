import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

type SpotItem = {
  id: string
  name: string
  address: string
  timeSlot?: string
  image: any
}

const TripDetailModifyScreen = () => {
  const router = useRouter()
  const { tripData, tripDate, tripDay } = useLocalSearchParams()
  const [tripItems, setTripItems] = useState<SpotItem[]>([])

  // Parse the passed trip data when the component mounts
  useEffect(() => {
    try {
      if (tripData) {
        const parsedTripData = JSON.parse(tripData as string)
        setTripItems(parsedTripData)
      }
    } catch (error) {
      console.error('Error parsing trip data:', error)
      Alert.alert('Error', 'Could not load trip data')
    }
  }, [tripData])

  const handleDragEnd = ({ data }: { data: SpotItem[] }) => {
    setTripItems(data)
    console.log('Thứ tự mới đã được lưu:', data)
  }

  const handleDeleteItem = (itemToDelete: SpotItem) => {
    Alert.alert('Delete Spot', 'Are you sure you want to delete this spot?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedItems = tripItems.filter(
            (item) => item.id !== itemToDelete.id
          )
          setTripItems(updatedItems)
        },
      },
    ])
  }

  const handleGoBack = () => {
    router.back()
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<SpotItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.spotCard,
            { backgroundColor: isActive ? '#f0f0f0' : '#FFFFFF' },
          ]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="menu-outline" size={24} color="#666" />
          </View>

          <View style={styles.spotImageContainer}>
            <Image
              source={item.image || require('@/assets/images/alligator.jpg')}
              style={styles.spotImage}
            />
          </View>
          <View style={styles.spotDetails}>
            <Text style={styles.spotName}>{item.name}</Text>
            <View style={styles.spotLocationContainer}>
              <Ionicons name="location" size={14} color="#888" />
              <Text style={styles.spotAddress}>{item.address}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item)}
          >
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header and Back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modify trip</Text>
      </View>

      {/* Day Navigation */}
      <View style={styles.dayNavigationContainer}>
        <Text style={styles.dayText}>
          Day {tripDay} ({tripDate})
        </Text>
      </View>

      {/* Add button */}
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => {
          // TODO: Implement add new spot functionality
          Alert.alert('Add Spot', 'Add new spot functionality coming soon')
        }}
      >
        <View style={styles.addButtonBorder}>
          <Ionicons name="add" size={24} color="#000" />
        </View>
      </TouchableOpacity>

      {/* Draggable list item */}
      <DraggableFlatList
        data={tripItems}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  },
  dayNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#563D30',
  },
  addButtonContainer: {
    alignSelf: 'center',
    backgroundColor: '#EEF8EF',
    borderRadius: 30,
    padding: 16,
    marginVertical: 16,
  },
  addButtonBorder: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
  },
  listContent: {
    paddingHorizontal: 20,
  },
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
    width: 120,
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
  spotAddress: {
    fontSize: 13,
    color: '#A68372',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
})

export default TripDetailModifyScreen
