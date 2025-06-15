import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useAiTripStore } from '@/store/useAiTripStore'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import NumStepper from '../NumStepper'
import Pressable from '../Pressable'

type SpotNumberProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function SpotNumber({
  theme,
  nextFn,
}: Readonly<SpotNumberProps>) {
  const setLocsPerDay = useAiTripStore((state) => state.setLocsPerDay)
  const request = useAiTripStore((state) => state.request)

  const [numberOfSpots, setNumberOfSpots] = useState<number>(
    request?.locationsPerDay ?? 5
  )

  useEffect(() => {
    setLocsPerDay(numberOfSpots)
  }, [numberOfSpots])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        How many spots do you want to visit per day?
      </Text>

      <View>
        <NumStepper
          size="large"
          value={numberOfSpots}
          onValueChange={setNumberOfSpots}
          minValue={5}
          maxValue={9}
        />
      </View>

      <Pressable
        onPress={nextFn}
        title="Next"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
        // disabled={numberOfSpots === 0} TODO : enable later
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  textQuestion: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: FontFamily.BOLD,
    fontSize: FontSize.XXXL,
  },
  errorText: {
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.XL,
  },
})
