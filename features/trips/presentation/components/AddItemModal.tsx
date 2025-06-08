import { Place } from '@/features/trips/domain/models/Place'
import React from 'react'
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { usePlaces } from '../state/usePlaces'
import { AddItemModalProps } from './TripPlanner'

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  selectedTime,
  onClose,
  onConfirm,
}) => {
  const handleAddPlace = (place: Place) => {
    onConfirm(place)
    onClose()
  }

  const { data: places } = usePlaces({
    limit: 20,
    location: 'Ho Chi Minh',
    language: 'en',
  })

  const renderPlace = ({ item }: { item: Place }) => (
    <View style={styles.placeContainer}>
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item._source.en_name}</Text>
        <Text style={styles.placeType}>{item._source.en_type}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddPlace(item)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
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
            <Text style={styles.modalTitle}>
              Add new place to {selectedTime}
            </Text>
          </View>

          <FlatList
            data={places}
            renderItem={renderPlace}
            keyExtractor={(item) => item._id}
            style={styles.placesList}
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
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  placesList: {
    flex: 1,
  },
  placeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
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
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#f3f3f3',
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
