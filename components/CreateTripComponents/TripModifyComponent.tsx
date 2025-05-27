import { useManualTripStore } from '@/store/manualTripStore'
import { TripItem } from '@/types/Trip/TripItem'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const tripItems: TripItem[] = [
  {
    id: '1',
    name: 'Alligator Swamp',
    category: 'Nature',
    location: 'Florida',
    address: '123 Swamp Rd, Florida',
  },
  {
    id: '2',
    name: 'Mountain Peak',
    category: 'Adventure',
    location: 'Colorado',
    address: '456 Peak St, Colorado',
  },
  {
    id: '3',
    name: 'City Park',
    category: 'Leisure',
    location: 'New York',
    address: '789 Park Ave, New York',
  },
]

export function TripModifyComponent() {
  const [addModalVisible, setAddModalVisible] = useState(false)

  const trip = useManualTripStore((state) => state.trip)
  const setTripItems = useManualTripStore((state) => state.setManualTrip)

  useEffect(() => {
    setTripItems({
      ...trip,
      items: tripItems,
    })
  }, [])

  // const { trip, setTrip, deleteTripItem } = useManualTripStore((state) => ({
  //   trip: state.trip,
  //   setTrip: state.setManualTrip,
  //   deleteTripItem: state.deleteTripItem,
  // }))

  const handleDragEnd = ({ data }: { data: TripItem[] }) => {
    setTripItems({
      ...trip,
      items: data,
    })
    console.log('Thứ tự mới đã được lưu:', data)
  }

  // const handleDeleteItem = (itemToDelete: TripItem) => {
  //   Alert.alert('Delete Spot', 'Are you sure you want to delete this spot?', [
  //     {
  //       text: 'Cancel',
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'Delete',
  //       style: 'destructive',
  //       onPress: () => {
  //         const updatedItems = trip.items?.filter(
  //           (item) => item.id !== itemToDelete.id
  //         )
  //         deleteTripItem(itemToDelete.id)
  //       },
  //     },
  //   ])
  // }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<TripItem>) => {
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
              source={require('@/assets/images/alligator.jpg')}
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

          {/* <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item)}
            >
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity> */}
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  return (
    <>
      {/* <Modal
        visible={addModalVisible}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
        presentationStyle="fullScreen"
      >
        <AddItemComponent
          currentTrip={tripItems}
          onClose={() => setAddModalVisible(false)}
          onAddItem={setTripItems}
        />
      </Modal> */}
      <GestureHandlerRootView style={styles.container}>
        {/* Add button */}
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            setAddModalVisible(true)
          }}
        >
          <View style={styles.addButtonBorder}>
            <Ionicons name="add" size={24} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Draggable list item */}
        <DraggableFlatList
          data={trip.items ?? []}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </GestureHandlerRootView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
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
    width: '100%',
    height: 'auto',
  },
  spotCard: {
    flexDirection: 'row',
    width: '100%',
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
  spotAddress: {
    fontSize: 13,
    color: '#A68372',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
})
