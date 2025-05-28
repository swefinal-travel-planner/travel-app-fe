import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useManualTripStore } from '@/store/manualTripStore'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, View } from 'react-native-ui-lib'
import HorizontalDatePicker from './HorizontalDatePicker'
import TripPlanner from './TripPlanner'

type ManualTripCreateProps = {
  nextFn: () => void
}

export default function ManualTripCreate({
  nextFn,
}: Readonly<ManualTripCreateProps>) {
  const setManualTrip = useManualTripStore((state) => state.setManualTrip)
  const trip = useManualTripStore((state) => state.trip)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    if (trip.startDate && selectedDate === null) {
      setSelectedDate(new Date(trip.startDate))
    }
  }, [trip.startDate, selectedDate])

  const theme = useThemeStyle()

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
      <TripPlanner />
      <Button
        onPress={nextFn}
        label="Next"
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15, marginTop: 15 }}
      ></Button>
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
})
