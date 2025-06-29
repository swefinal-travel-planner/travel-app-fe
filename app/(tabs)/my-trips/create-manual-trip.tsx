import CreateTripNavigationBar from '@/components/CreateTripComponents/CreateTripNavigationBar'
import { createManualTripSteps, TRIP_TYPES } from '@/constants/createTrip'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'

export default function ManualCreateTripScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [currentStep, setCurrentStep] = useState(0)
  const StepComponent = createManualTripSteps[currentStep]
  const router = useRouter()

  const goNext = () => {
    if (currentStep < createManualTripSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
    if (currentStep === 0) {
      router.back()
    }
  }

  return (
    <View style={styles.safeAreaContainer}>
      <CreateTripNavigationBar type={TRIP_TYPES.MANUAL} theme={theme} goback={goBack} currentStep={currentStep} />
      <StepComponent theme={theme} nextFn={goNext} />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eef8ef',
      paddingTop: 55,
    },
    container: {
      flex: 1,
    },
  })
