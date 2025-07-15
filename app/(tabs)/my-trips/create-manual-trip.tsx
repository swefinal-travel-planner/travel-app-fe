import { createManualTripSteps, TRIP_TYPES } from '@/constants/createTripSteps'
import UnifiedTripCreator from '@/features/trip/presentation/components/CreateTrip/UnifiedTripCreator'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React from 'react'
import { Alert } from 'react-native'

export default function ManualCreateTripScreen() {
  const theme = useThemeStyle()
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

  const handleComplete = () => {
    router.push('/(tabs)/my-trips')
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <UnifiedTripCreator
      tripType={TRIP_TYPES.MANUAL}
      steps={createManualTripSteps}
      theme={theme}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  )
}
