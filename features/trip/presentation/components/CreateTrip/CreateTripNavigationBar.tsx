import { createAiTripSteps, createManualTripSteps, TRIP_TYPES } from '@/constants/createTripSteps'
import { colorPalettes } from '@/constants/Itheme'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, ProgressBar } from 'react-native-ui-lib'

type CreateTripNavigationBarProps = {
  type: string
  theme: typeof colorPalettes.light
  currentStep: number
  isLastStep?: boolean
  goback: () => void
}

export default function CreateTripNavigationBar({
  theme,
  goback,
  currentStep,
  isLastStep = false,
  type,
}: Readonly<CreateTripNavigationBarProps>) {
  const numberOfSteps = type === TRIP_TYPES.MANUAL ? createManualTripSteps.length : createAiTripSteps.length

  return (
    <View style={styles.createTripNavigationBar}>
      {!isLastStep && (
        <Button
          backgroundColor="transparent"
          style={styles.button}
          round={true}
          onPress={goback}
          fullWidth={true}
          avoidInnerPaddings={true}
        >
          <Ionicons name="arrow-back" size={20} color={theme.primary} />
        </Button>
      )}

      <ProgressBar
        progress={(currentStep / (numberOfSteps - 1)) * 100}
        progressColor={theme.primary}
        style={[styles.progressBar, { backgroundColor: theme.secondary }]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  createTripNavigationBar: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 24,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    height: 'auto',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
})
