import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button, View } from 'react-native-ui-lib'
import { CreateTripDTO } from '../../domain/models/Trip'
import { useCreateTrip } from '../state/useCreateTrip'
import TripPlanner, { TypedTripItem } from './TripPlanner'
import { useManualTripStore } from '../state/useManualTrip'
import HorizontalDatePicker from './HorizontalDatePicker'

type ManualTripCreateProps = {
  nextFn: () => void
}

export default function ManualTripCreate({
  nextFn,
}: Readonly<ManualTripCreateProps>) {
  const { createTrip, isLoading, error } = useCreateTrip()
  const { trip, setManualTrip } = useManualTripStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [tripItems, setTripItems] = useState<TypedTripItem[]>([])

  useEffect(() => {
    if (trip.startDate && selectedDate === null) {
      setSelectedDate(new Date(trip.startDate))
    }
  }, [trip.startDate, selectedDate])

  const theme = useThemeStyle()

  const handleNext = async () => {
    if (!selectedDate) {
      // Handle validation error
      return
    }

    // Convert TypedTripItems to TripItems
    const items = tripItems.map(({ type, place, ...item }) => ({
      ...item,
      place_id: place?.id || null,
    }))

    const createTripDTO: CreateTripDTO = {
      name: trip.name || 'Untitled Trip',
      startDate: selectedDate,
      numberOfDays: trip.numberOfDays || 1,
      location: trip.location || 'Unknown',
      description: trip.description,
      imageUrl: trip.imageUrl,
      items,
    }

    const createdTrip = await createTrip(createTripDTO)
    if (createdTrip) {
      setManualTrip(createdTrip)
      nextFn()
    }
  }

  if (error) {
    // Handle error state
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Error: {error.message}</Text>
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
      <TripPlanner onTripItemsChange={setTripItems} />
      <Button
        onPress={handleNext}
        label={isLoading ? 'Creating...' : 'Next'}
        disabled={isLoading}
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
