import Pressable from '@/components/Pressable'
import { CreateTripDTO } from '@/features/trip/domain/models/Trip'
import { convertManualTripToDTO, ensureAllDatesIncluded } from '@/features/trip/utils/TripUtils'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { View } from 'react-native-ui-lib'
import { useCreateTrip } from '../../state/useCreateTrip'
import { useManualTripStore } from '../../state/useManualTrip'
import { useUpdateTripItem } from '../../state/useUpdateTripItem'
import DayPlanner from './DayPlanner'
import HorizontalDatePicker from './HorizontalDatePicker'

type ManualTripCreateProps = {
  nextFn: () => void
}

export default function ManualTripCreate({ nextFn }: Readonly<ManualTripCreateProps>) {
  const { createTrip, isLoading: isCreating, error: createError } = useCreateTrip()
  const { updateTripItems, isLoading: isUpdating, error: updateError } = useUpdateTripItem()

  const { request, getItemsForDate } = useManualTripStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    setSelectedDate(request?.startDate ? new Date(request.startDate) : null)
  }, [request?.startDate])

  const theme = useThemeStyle()

  const handleNext = async () => {
    if (!selectedDate) {
      // Handle validation error
      return
    }

    // Get all items for the selected date
    const items = getItemsForDate(selectedDate)

    const createTripDTO: CreateTripDTO = {
      title: request?.title ?? 'Untitled Trip',
      startDate: selectedDate,
      days: request?.days ?? 1,
    }

    const createdTripId = await createTrip(createTripDTO)

    if (createdTripId) {
      const { request, itemsByDate } = useManualTripStore.getState()

      // First ensure all dates are included
      const completeItemsByDate = ensureAllDatesIncluded(request, itemsByDate)

      // Then convert to DTO format for API calls
      const tripItems = convertManualTripToDTO(request, completeItemsByDate)

      updateTripItems(createdTripId, tripItems)

      nextFn() // Proceed to the next step
    }
  }

  if (createError) {
    // Handle error state
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Error: {createError.message}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container]}>
      {selectedDate && (
        <HorizontalDatePicker
          request={request}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          theme={theme}
        />
      )}
      {selectedDate && <DayPlanner selectedDate={selectedDate} />}
      <Pressable
        onPress={handleNext}
        title={isCreating ? 'Creating...' : 'Next'}
        disabled={isCreating}
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
          minWidth: '100%',
          paddingVertical: 15,
          marginTop: 15,
        }}
      />
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
