import CreateTripNavigationBar from '@/components/CreateTripComponents/CreateTripNavigationBar'
import { createManualTripSteps } from '@/constants/createTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'

export default function ManualCreateTripScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [currentStep, setCurrentStep] = useState(0)
  const StepComponent = createManualTripSteps[currentStep]

  const goNext = () => {
    if (currentStep < createManualTripSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <View style={styles.safeAreaContainer}>
      <CreateTripNavigationBar
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
      backgroundColor: '#eef8ef',
    },
    container: {
      flex: 1,
    },
  })
