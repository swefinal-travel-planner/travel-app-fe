import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Cities } from '@/constants/location'
import { Radius } from '@/constants/theme'
import { TripRequest } from '@/store/useAiTripStore'
import { DebugWrapper } from '@/utils/DebugWrapper'
import { Camera, MapView } from '@rnmapbox/maps'
import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Picker, Text, View } from 'react-native-ui-lib'

type TripLocationProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
  setTripState: (trip: Partial<TripRequest>) => void
}

export default function TripLocation({ theme, nextFn, setTripState }: Readonly<TripLocationProps>) {
  const styles = useMemo(() => createStyles(theme), [theme])
  const [selectedCityKey, setSelectedCityKey] = useState(Cities[0].key)
  const [selectedDistrictKey, setSelectedDistrictKey] = useState(Cities[0].districts[0].key)

  // Find selected city and district
  const selectedCity = useMemo(
    () => Cities.find((city) => city.key === selectedCityKey) || Cities[0],
    [selectedCityKey]
  )
  const selectedDistrict = useMemo(
    () => selectedCity.districts.find((d) => d.key === selectedDistrictKey) || selectedCity.districts[0],
    [selectedCity, selectedDistrictKey]
  )

  // Ensure we always have valid coordinates
  const mapCoordinates = useMemo(() => {
    return selectedDistrict?.coordinates || selectedCity.districts[0].coordinates
  }, [selectedDistrict, selectedCity])

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.primary }]}>Where is your trip located ?</Text>

      <View style={[styles.locationContainer, { backgroundColor: theme.background }]}>
        <Text style={{ alignSelf: 'flex-start', marginBottom: 4, color: theme.primary, fontWeight: 'bold' }}>City</Text>
        {/* City Picker */}
        <Picker
          placeholder="Select a city"
          value={selectedCityKey}
          getLabel={(item) => Cities.find((city) => city.key === item)?.label ?? ''}
          onChange={(item) => {
            setSelectedCityKey(item?.toString() ?? '')
            // Reset district to first of new city
            const city = Cities.find((city) => city.key === item)
            setSelectedDistrictKey(city?.districts[0].key ?? '')
          }}
          topBarProps={{ title: 'Cities' }}
          style={styles.picker}
        >
          {Cities.map((city) => (
            <Picker.Item
              key={city.key}
              value={city.key}
              label={city.label}
              onPress={() => {
                setSelectedCityKey(city.key)
                setSelectedDistrictKey(city.districts[0].key)
              }}
            />
          ))}
        </Picker>

        <Text
          style={{ alignSelf: 'flex-start', marginTop: 16, marginBottom: 4, color: theme.primary, fontWeight: 'bold' }}
        >
          District
        </Text>

        <Picker
          placeholder="Select a destination"
          value={selectedDistrictKey}
          getLabel={(item) => selectedCity.districts.find((d) => d.key === item)?.label ?? ''}
          onChange={(item) => {
            setSelectedDistrictKey(item?.toString() ?? '')
          }}
          topBarProps={{ title: 'Districts' }}
          style={styles.picker}
        >
          {selectedCity.districts.map((district) => (
            <Picker.Item
              key={district.key}
              value={district.key}
              label={district.label}
              onPress={() => {
                setSelectedDistrictKey(district.key)
              }}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.mapContainer}>
        <MapView style={{ flex: 1 }} logoEnabled={true} scaleBarPosition={{ top: 8, left: 16 }}>
          <DebugWrapper>
            <Camera centerCoordinate={mapCoordinates} zoomLevel={13} />
          </DebugWrapper>
        </MapView>
      </View>

      <Pressable
        onPress={() => {
          nextFn()
          setTripState({ city: `${selectedDistrict.label},${selectedCity.label}` })
        }}
        title="Next"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
          marginTop: 16,
        }}
        disabled={!selectedCityKey || !selectedDistrictKey}
      />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    locationContainer: {
      marginBottom: 16,
      marginTop: 16,
    },
    mapContainer: {
      width: '100%',
      flex: 1,
      borderRadius: Radius.ROUNDED,
      overflow: 'hidden',
    },
    text: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.XXXL,
      textAlign: 'center',
    },
    picker: {
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.LG,
      backgroundColor: theme.white,
      minWidth: '100%',
      height: 48,
      borderRadius: Radius.FULL,
      padding: 12,
      color: theme.primary,
    },
  })
