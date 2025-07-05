import CreateTripNavigationBar from '@/components/CreateTripComponents/CreateTripNavigationBar'
import { createManualTripSteps, TRIP_TYPES } from '@/constants/createTrip'
import { colorPalettes } from '@/constants/Itheme'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'

export default function ManualCreateTripScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [currentStep, setCurrentStep] = useState(0)
  const StepComponent = createManualTripSteps[currentStep]
  const router = useRouter()
  const navigation = useNavigation()

  const resetManualTrip = useManualTripStore((state) => state.resetManualTrip)

  // Handle Android back button
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = (e: any) => {
        // Prevent default navigation
        e.preventDefault()

        Alert.alert('Discard Changes', 'Are you sure you want to go back? All trip data will be cleared.', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes, go back',
            style: 'destructive',
            onPress: () => {
              resetManualTrip()
              router.push('/(tabs)/my-trips')
            },
          },
        ])
      }

      navigation.addListener('beforeRemove', handleBackPress)

      return () => {
        navigation.removeListener('beforeRemove', handleBackPress)
      }
    }, [navigation, resetManualTrip, router])
  )

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
