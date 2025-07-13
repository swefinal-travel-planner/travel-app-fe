import { Radius } from '@/constants/theme'
import { Place } from '@/features/place/domain/models/Place'
import { TimeSlot } from '@/features/trip/domain/models/Trip'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { usePlaces } from '../state/usePlaces'
import { LabelFilterModal } from './LabelFilterModal'
import { Image } from 'expo-image'

export interface AddPlaceModalProps {
  visible: boolean
  selectedTime: TimeSlot | null
  onClose: () => void
  onConfirm: (places: Place[]) => void
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ visible, selectedTime, onClose, onConfirm }) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([])
  const [shouldFetchPlaces, setShouldFetchPlaces] = useState(false)
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])

  useEffect(() => {
    if (visible) {
      setShouldFetchPlaces(true)
    } else {
      // Reset selected places when modal closes
      setSelectedPlaces([])
      setShouldFetchPlaces(false)
      setSelectedLabels([])
    }
  }, [visible])

  const {
    data: places,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = usePlaces({
    limit: 20,
    location: 'Ho Chi Minh',
    language: 'en',
    enabled: shouldFetchPlaces,
    filter: selectedLabels.length > 0 ? selectedLabels.join(',') : undefined,
  })

  const handleTogglePlace = (place: Place) => {
    setSelectedPlaces((current) => {
      const isSelected = current.some((p) => p.id === place.id)
      if (isSelected) {
        return current.filter((p) => p.id !== place.id)
      } else {
        return [...current, place]
      }
    })
  }

  const handleDone = () => {
    onConfirm(selectedPlaces)
    setSelectedPlaces([])
    onClose()
  }

  const handleFilterPress = () => {
    setIsFilterModalVisible(true)
  }

  const handleLabelSelect = (labels: string[]) => {
    setSelectedLabels(labels)
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View style={styles.loadingFooter}>
        <Text>Loading more places...</Text>
      </View>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error loading places: {error.message}</Text>
        </View>
      )
    }

    return (
      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={(item) => item.id}
        style={styles.placesList}
        contentContainerStyle={styles.placesListContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
      />
    )
  }

  const renderPlace = ({ item }: { item: Place }) => {
    const isSelected = selectedPlaces.some((p) => p.id === item.id)
    return (
      <View style={[styles.placeContainer, isSelected && styles.selectedContainer]}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.images[0],
            }}
            style={styles.placeImage}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeType}>{item.type}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, isSelected && styles.selectedButton]}
            onPress={() => handleTogglePlace(item)}
          >
            <Text style={styles.addButtonText}>{isSelected ? 'Selected' : 'Select'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <Modal transparent={false} visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>Add places to {selectedTime}</Text>
              <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                <Ionicons name="filter-outline" size={24} color="#563D30" />
              </TouchableOpacity>
            </View>
          </View>

          {renderContent()}

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.doneButton, selectedPlaces.length === 0 && styles.disabledButton]}
              onPress={handleDone}
              disabled={selectedPlaces.length === 0}
            >
              <Text style={[styles.buttonText, styles.doneText]}>Done ({selectedPlaces.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <LabelFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleLabelSelect}
        initialSelectedLabels={selectedLabels}
      />
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
  selectedContainer: {
    borderColor: '#563D30',
    borderWidth: 2,
  },
  selectedButton: {
    backgroundColor: '#808080',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: Radius.FULL,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  doneButton: {
    backgroundColor: '#563D30',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelText: {
    color: '#333',
  },
  doneText: {
    color: 'white',
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
  loadingFooter: {
    padding: 10,
    alignItems: 'center',
  },
})
