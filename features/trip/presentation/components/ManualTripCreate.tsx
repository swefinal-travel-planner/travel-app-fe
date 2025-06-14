import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button, View } from 'react-native-ui-lib'
import { CreateTripDTO } from '../../domain/models/Trip'
import { useCreateTrip } from '../state/useCreateTrip'
import { useManualTripStore } from '../state/useManualTrip'
import { useUpdateTripItem } from '../state/useUpdateTripItem'
import DayPlanner from './DayPlanner'
import HorizontalDatePicker from './HorizontalDatePicker'

type ManualTripCreateProps = {
  nextFn: () => void
}

export default function ManualTripCreate({
  nextFn,
}: Readonly<ManualTripCreateProps>) {
  const {
    createTrip,
    isLoading: isCreating,
    error: createError,
  } = useCreateTrip()
  const {
    updateTripItem,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateTripItem()

  const { trip, setManualTrip, getItemsForDate, log } = useManualTripStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    setSelectedDate(trip.startDate ? new Date(trip.startDate) : null)
  }, [trip.startDate])

  const theme = useThemeStyle()

  const handleNext = async () => {
    if (!selectedDate) {
      // Handle validation error
      return
    }

    // Get all items for the selected date
    const items = getItemsForDate(selectedDate)

    const createTripDTO: CreateTripDTO = {
      city: 'Ho Chi Minh City', // Default city, can be changed later
      title: trip.title ?? 'Untitled Trip',
      startDate: selectedDate,
      days: trip.days ?? 1,
    }

    // const createdTripId = await createTrip(createTripDTO)
    const createdTripId = 4 // Mocked ID for demonstration purposes

    if (createdTripId) {
      log() // Log the current state for debugging

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
          trip={trip}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          theme={theme}
        />
      )}
      {selectedDate && <DayPlanner selectedDate={selectedDate} />}
      <Button
        onPress={handleNext}
        label={isCreating ? 'Creating...' : 'Next'}
        disabled={isCreating}
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15, marginTop: 15 }}
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
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
