import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/styles/Itheme'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'react-native-ui-lib'
import NumStepper from '../NumStepper'

type SpotNumberProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function SpotNumber({
  theme,
  nextFn,
}: Readonly<SpotNumberProps>) {
  const [numberOfSpots, setNumberOfSpots] = useState<number>(5)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleNext = () => {
    if (numberOfSpots === null || numberOfSpots < 1) {
      setErrorMessage('Please enter a valid number of spots.')
      return
    }

    setErrorMessage(null)
    nextFn()
  }

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

        {errorMessage && (
          <Text style={[styles.errorText, { color: theme.error ?? 'red' }]}>
            {errorMessage}
          </Text>
        )}
      </View>

      <Button
        onPress={handleNext}
        label="Next"
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15 }}
        size="large"
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
