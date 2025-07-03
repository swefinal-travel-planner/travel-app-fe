import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Location } from '@/constants/location'
import { Radius } from '@/constants/theme'
import { useAiTripStore } from '@/store/useAiTripStore'
import { Camera, MapView } from '@rnmapbox/maps'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Picker, Text, View } from 'react-native-ui-lib'

type TripLocationProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function TripLocation({ theme, nextFn }: Readonly<TripLocationProps>) {
  const styles = useMemo(() => createStyles(theme), [theme])
  const setCity = useAiTripStore((state) => state.setCity)
  const request = useAiTripStore((state) => state.request)

  const [selectedValue, setSelectedValue] = React.useState<string>(
    Location.find((loc) => loc.label === request?.city)?.key ?? ''
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <Text style={[styles.text, { color: theme.primary }]}>Where is your trip located ?</Text>
      <Picker
        placeholder="Select a destination"
        value={selectedValue}
        getLabel={(item) => {
          return Location.find((loc) => loc.key === item)?.label ?? ''
        }}
        onChange={(item) => {
          setSelectedValue(item?.toString() ?? '')
        }}
        topBarProps={{ title: 'Destinations' }}
        style={styles.picker}
      >
        {Location.map((location) => {
          return (
            <Picker.Item
              key={location.key}
              value={location.key}
              label={location.label}
              onPress={() => {
                setSelectedValue(location.key)
                setCity(location.label)
              }}
            />
          )
        })}
      </Picker>
      <View style={styles.mapContainer}>
        <MapView style={{ flex: 1 }} logoEnabled={true} scaleBarPosition={{ top: 8, left: 16 }}>
          <Camera
            centerCoordinate={Location.find((loc) => loc.key == selectedValue)?.coordinates || Location[0].coordinates}
            zoomLevel={11}
          />
        </MapView>
      </View>
      <Pressable
        onPress={nextFn}
        title="Next"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
        // disabled={!selectedValue} TODO: enable later
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
    mapContainer: {
      width: '100%',
      height: '65%',
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
      backgroundColor: theme.background,
      minWidth: '100%',
      height: 48,
      borderRadius: Radius.FULL,
      padding: 12,
      color: theme.primary,
    },
  })
