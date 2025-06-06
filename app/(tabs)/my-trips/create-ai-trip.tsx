import CreateTripNavigationBar from '@/components/CreateTripComponents/CreateTripNavigationBar'
import { createAiTripSteps, TRIP_TYPES } from '@/constants/createTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'

export default function AiCreateTripScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [currentStep, setCurrentStep] = useState(0)
  const StepComponent = createAiTripSteps[currentStep]
  const router = useRouter()

  const goNext = () => {
    if (currentStep < createAiTripSteps.length - 1) {
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
      <CreateTripNavigationBar
        type={TRIP_TYPES.AI}
        theme={theme}
        goback={goBack}
        currentStep={currentStep}
      />
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
      backgroundColor: theme.white,
      paddingVertical: 40,
    },
    container: {
      flex: 1,
    },
  })
