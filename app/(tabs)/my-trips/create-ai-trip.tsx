import CreateTripNavigationBar from '@/components/CreateTripComponents/CreateTripNavigationBar'
import { createAiTripSteps, TRIP_TYPES } from '@/constants/createTrip'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useAiTripStore } from '@/store/useAiTripStore'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'

export default function AiCreateTripScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [currentStep, setCurrentStep] = useState(0)
  const StepComponent = createAiTripSteps[currentStep]
  const router = useRouter()
  const navigation = useNavigation()

  const clearRequest = useAiTripStore((state) => state.clearRequest)
  const setRequest = useAiTripStore((state) => state.setRequest)
  const getRequest = useAiTripStore((state) => state.request)

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
              clearRequest()
              router.push('/(tabs)/my-trips')
            },
          },
        ])
      }

      navigation.addListener('beforeRemove', handleBackPress)

      return () => {
        navigation.removeListener('beforeRemove', handleBackPress)
      }
    }, [navigation, clearRequest, router])
  )

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
        isLastStep={currentStep === createAiTripSteps.length - 1}
      />
      <StepComponent theme={theme} nextFn={goNext} setTripState={setRequest} getTripState={getRequest} />
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
