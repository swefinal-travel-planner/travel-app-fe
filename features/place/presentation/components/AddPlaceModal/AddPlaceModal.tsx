import { Place } from '@/features/place/domain/models/Place'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Modal, View } from 'react-native'
import { LabelFilterModal } from '../LabelFilterModal'
import { ErrorState, LoadingFooter, LoadingState } from './components/LoadingStates'
import { ModalFooter } from './components/ModalFooter'
import { ModalHeader } from './components/ModalHeader'
import { PlaceItem } from './components/PlaceItem'
import { usePlaceData } from './hooks/usePlaceData'
import { usePlaceSelection } from './hooks/usePlaceSelection'
import { createModalStyles } from './styles'
import { AddPlaceModalProps } from './types'

export function AddPlaceModal({ visible, selectedTime, onClose, onConfirm }: Readonly<AddPlaceModalProps>) {
  const theme = useThemeStyle()
  const styles = createModalStyles(theme)

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [shouldFetchPlaces, setShouldFetchPlaces] = useState(false)

  const { selectedPlaces, selectedLabels, togglePlace, resetSelection, updateLabels } = usePlaceSelection()
  const { places, isLoading, error, loadMore, isFetchingNextPage } = usePlaceData(shouldFetchPlaces, selectedLabels)

  // Effects
  useEffect(() => {
    if (visible) {
      setShouldFetchPlaces(true)
    } else {
      resetSelection()
      setShouldFetchPlaces(false)
    }
  }, [visible, resetSelection])

  // Event Handlers
  const handleDone = useCallback(() => {
    onConfirm(selectedPlaces)
    resetSelection()
    onClose()
  }, [selectedPlaces, onConfirm, resetSelection, onClose])

  const handleFilterPress = useCallback(() => {
    setIsFilterModalVisible(true)
  }, [])

  const handleLabelSelect = useCallback(
    (labels: string[]) => {
      updateLabels(labels)
    },
    [updateLabels]
  )

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  // Render Functions
  const renderPlace = useCallback(
    ({ item }: { item: Place }) => {
      const isSelected = selectedPlaces.some((p) => p.id === item.id)
      return <PlaceItem place={item} isSelected={isSelected} onToggle={togglePlace} theme={theme} />
    },
    [selectedPlaces, togglePlace, theme]
  )

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState theme={theme} />
    }

    if (error) {
      return <ErrorState error={error} theme={theme} />
    }

    return (
      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={(item) => item.id}
        style={styles.placesList}
        contentContainerStyle={styles.placesListContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={isFetchingNextPage ? <LoadingFooter theme={theme} /> : null}
      />
    )
  }

  return (
    <Modal transparent={false} visible={visible} onRequestClose={handleClose} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ModalHeader
            selectedTime={selectedTime}
            onFilterPress={handleFilterPress}
            theme={theme}
            filterCount={selectedLabels.length}
          />

          {renderContent()}

          <ModalFooter selectedCount={selectedPlaces.length} onCancel={handleClose} onDone={handleDone} theme={theme} />
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
