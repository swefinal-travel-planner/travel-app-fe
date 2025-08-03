import { Place } from '@/features/place/domain/models/Place'
import { useCallback, useState } from 'react'

export const usePlaceSelection = () => {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])

  const togglePlace = useCallback((place: Place) => {
    setSelectedPlaces((current) => {
      const isSelected = current.some((p) => p.id === place.id)
      if (isSelected) {
        return current.filter((p) => p.id !== place.id)
      } else {
        return [...current, place]
      }
    })
  }, [])

  const resetSelection = useCallback(() => {
    setSelectedPlaces([])
    setSelectedLabels([])
  }, [])

  const updateLabels = useCallback((labels: string[]) => {
    setSelectedLabels(labels)
  }, [])

  return {
    selectedPlaces,
    selectedLabels,
    togglePlace,
    resetSelection,
    updateLabels,
  }
}
