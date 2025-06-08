import { Radius } from '@/constants/theme'
import { Place } from '@/features/place/domain/models/Place'
import { TimeSlot } from '@/types/Trip/Trip'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { usePlaces } from '../../../place/presentation/state/usePlaces'

export interface AddPlaceModalProps {
  visible: boolean
  selectedTime: TimeSlot | null
  onClose: () => void
  onConfirm: (place: Place) => void
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  visible,
  selectedTime,
  onClose,
  onConfirm,
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false)

  const handleAddPlace = (place: Place) => {
    onConfirm(place)
    onClose()
  }

  const handleFilterPress = () => {
    setIsFilterVisible(!isFilterVisible)
  }

  const { data: places } = usePlaces({
    limit: 20,
    location: 'Ho Chi Minh',
    language: 'en',
  })

  const renderPlace = ({ item }: { item: Place }) => (
    <View style={styles.placeContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/alligator.jpg')}
          style={styles.placeImage}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{item.en_name}</Text>
          <Text style={styles.placeType}>{item.en_type}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddPlace(item)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <Modal
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>
                Add new place to {selectedTime}
              </Text>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleFilterPress}
              >
                <Ionicons name="filter-outline" size={24} color="#563D30" />
              </TouchableOpacity>
            </View>
            {isFilterVisible && (
              <View style={styles.filterContainer}>
                <Text>Filter options will go here</Text>
              </View>
            )}
          </View>

          <FlatList
            data={places}
            renderItem={renderPlace}
            keyExtractor={(item) => item.id}
            style={styles.placesList}
            contentContainerStyle={styles.placesListContent}
          />

          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterButton: {
    position: 'absolute',
    right: 10,
    borderRadius: Radius.FULL,
  },
  filterContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: Radius.NORMAL,
    marginTop: 10,
  },
  placesList: {
    flex: 1,
  },
  placesListContent: {
    gap: 15,
  },
  placeContainer: {
    flexDirection: 'column',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f5f5f5',
    borderRadius: Radius.NORMAL,
    gap: 12,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#563D30',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: Radius.FULL,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalButton: {
    padding: 15,
    borderRadius: Radius.FULL,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: Radius.FULL,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
})
