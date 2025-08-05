import Pressable from '@/components/Pressable'
import { CreateTripDTO } from '@/features/trip/domain/models/Trip'
import { convertManualTripToDTO, ensureAllDatesIncluded } from '@/features/trip/utils/TripUtils'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripDetails } from '@/hooks/useTripDetails'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { View } from 'react-native-ui-lib'
import { useCreateTrip } from '../../../state/useCreateTrip'
import { useManualTripStore } from '../../../state/useManualTrip'
import { useUpdateTripItem } from '../../../state/useUpdateTripItem'
import DayPlanner from './DayPlanner'
import HorizontalDatePicker from './HorizontalDatePicker'

type UpdateManualTripProps = {
  nextFn?: () => void
  mode?: 'create' | 'edit'
  tripId?: string
}

export default function UpdateManualTrip({ nextFn, mode = 'create', tripId }: Readonly<UpdateManualTripProps>) {
  const { createTrip, isLoading: isCreating, error: createError } = useCreateTrip()
  const { updateTripItems, isLoading: isUpdating, error: updateError } = useUpdateTripItem()
  const router = useRouter()
  const params = useLocalSearchParams()

  // Use tripId from props or URL params
  const currentTripId = tripId || (params?.id as string)

  // Load trip data for edit mode
  const {
    trip,
    tripItems,
    groupedItems,
    loading: loadingTripData,
  } = mode === 'edit' && currentTripId
    ? useTripDetails(currentTripId)
    : { trip: null, tripItems: [], groupedItems: [], loading: false }

  const { request, getItemsForDate, setRequest, loadExistingTrip, setEditMode, isEditMode, hasAnyItems, itemsByDate } =
    useManualTripStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const hasLoadedDataRef = useRef(false)

  // Load existing trip data when in edit mode - only run once
  useEffect(() => {
    if (
      mode === 'edit' &&
      trip &&
      groupedItems &&
      !loadingTripData &&
      groupedItems.length > 0 &&
      !hasLoadedDataRef.current
    ) {
      hasLoadedDataRef.current = true

      // Flatten grouped items into a single array and map to manual trip format
      const allSpots = groupedItems.flatMap((group) => group.spots)
      const mappedTripItems = allSpots.map((item: any) => ({
        item_id: item.placeID?.toString() || item.id?.toString() || '',
        title: item.name || 'Untitled Place',
        category: item.category || '',
        location: item.address || '',
        address: item.address || '',
        tripDay: item.tripDay || 1,
        timeInDate: item.timeSlot || 'morning',
        orderInDay: item.orderInDay || 1,
        placeID: item.placeID?.toString() || item.id?.toString() || '',
        type: 'item', // Required for TypedTripItem
        // Add place object for rendering
        place: {
          id: item.placeID?.toString() || item.id?.toString() || '',
          name: item.name || 'Untitled Place',
          address: item.address || '',
          images: item.image?.uri ? [item.image.uri] : [],
          location: {
            lat: 0,
            long: 0,
          },
          properties: [],
          type: item.category || 'place',
        },
      }))

      loadExistingTrip(trip, mappedTripItems)
    } else if (mode === 'create' && !hasLoadedDataRef.current) {
      hasLoadedDataRef.current = true
      setEditMode(false)
    }
  }, [mode, trip, groupedItems, loadingTripData])

  useEffect(() => {
    if (request?.startDate) {
      const newDate = new Date(request.startDate)
      // Only update if the date is actually different to prevent unnecessary re-renders
      setSelectedDate((current) => {
        if (!current || current.getTime() !== newDate.getTime()) {
          return newDate
        }
        return current
      })
    } else {
      setSelectedDate(null)
    }
  }, [request?.startDate])

  // Clear validation error when items are added or removed
  useEffect(() => {
    if (validationError && hasAnyItems()) {
      setValidationError(null)
    }
  }, [validationError, itemsByDate])

  const theme = useThemeStyle()

  const handleSaveOrNext = async () => {
    // Clear any previous validation errors
    setValidationError(null)

    if (!selectedDate) {
      setValidationError('Please select a start date')
      return
    }

    // Check if there are any items in the trip
    if (!hasAnyItems()) {
      setValidationError('Please add at least one place to your trip before proceeding')
      return
    }

    if (mode === 'edit' && currentTripId) {
      // Edit mode: Update existing trip
      const { request, itemsByDate } = useManualTripStore.getState()

      // First ensure all dates are included
      const completeItemsByDate = ensureAllDatesIncluded(request, itemsByDate)

      // Then convert to DTO format for API calls
      const tripItems = convertManualTripToDTO(request, completeItemsByDate)

      try {
        await updateTripItems(parseInt(currentTripId), tripItems)
        router.back() // Return to trip details
      } catch (error) {
        console.error('Error updating trip:', error)
      }
    } else {
      const createTripDTO: CreateTripDTO = {
        title: request?.title ?? 'Untitled Trip',
        city: request?.city ?? '',
        startDate: selectedDate,
        days: request?.days ?? 1,
      }

      const createdTripId = await createTrip(createTripDTO)

      if (createdTripId) {
        const { request, itemsByDate } = useManualTripStore.getState()
        setRequest({ id: createdTripId })

        // First ensure all dates are included
        const completeItemsByDate = ensureAllDatesIncluded(request, itemsByDate)

        // Then convert to DTO format for API calls
        const tripItems = convertManualTripToDTO(request, completeItemsByDate)

        updateTripItems(createdTripId, tripItems)

        if (nextFn) {
          nextFn() // Proceed to the next step
        }
      }
    }
  }

  if (createError || updateError) {
    // Handle error state
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Error: {(createError || updateError)?.message}</Text>
      </View>
    )
  }

  if (mode === 'edit' && loadingTripData) {
    // Show loading state while fetching trip data
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading trip data...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container]}>
      {selectedDate && (
        <HorizontalDatePicker request={request} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}
      {selectedDate && <DayPlanner selectedDate={selectedDate} />}
      {validationError && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error || '#ff0000' }]}>{validationError}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleSaveOrNext}
          title={mode === 'edit' ? (isUpdating ? 'Saving...' : 'Save changes') : isCreating ? 'Creating...' : 'Next'}
          disabled={isCreating || isUpdating}
          style={{
            color: theme.white,
            backgroundColor: theme.primary,
            minWidth: '100%',
            paddingVertical: 15,
            marginTop: 15,
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})
