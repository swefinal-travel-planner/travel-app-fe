import { FontFamily, FontSize } from '@/constants/font'
import { Location } from '@/constants/location'
import { colorPalettes } from '@/styles/Itheme'
import { Camera, MapView } from '@rnmapbox/maps'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Picker, Text, View } from 'react-native-ui-lib'

type ChooseLocationProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function ChooseLocation({
  theme,
  nextFn,
}: Readonly<ChooseLocationProps>) {
  const [selectedValue, setSelectedValue] = React.useState<string>('')
  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <Text style={[styles.text, { color: theme.primary }]}>
        Where is your trip located ?
      </Text>
      <Picker
        placeholder="Select a destination"
        value={selectedValue}
        getLabel={(item) => {
          return Location.find((loc) => loc.key === item)?.label ?? ''
        }}
        onChange={(item) => setSelectedValue(item?.toString() ?? '')}
        topBarProps={{ title: 'Destinations' }}
      >
        {Location.map((location) => {
          return (
            <Picker.Item
              key={location.key}
              value={location.key}
              label={location.label}
              onPress={() => setSelectedValue(location.key)}
            />
          )
        })}
      </Picker>
      <View style={styles.mapContainer}>
        <MapView style={{ flex: 1 }} logoEnabled={false}>
          <Camera
            centerCoordinate={
              Location.find((loc) => loc.key == selectedValue)?.coordinates
            }
            zoomLevel={11}
          />
        </MapView>
      </View>
      <Button
        onPress={nextFn}
        label="Next"
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15 }}
      ></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: '30%',
  },
  mapContainer: {
    width: '100%',
    height: '70%',
  },
  text: {
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.XXXL,
  },
})
