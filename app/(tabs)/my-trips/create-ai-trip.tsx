import UnifiedTripCreator from '@/components/CreateTripComponents/UnifiedTripCreator'
import { createAiTripSteps, TRIP_TYPES } from '@/constants/createTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useAiTripStore } from '@/store/useAiTripStore'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React from 'react'
import { Alert } from 'react-native'

export default function AiCreateTripScreen() {
  const theme = useThemeStyle()
  const router = useRouter()
  const navigation = useNavigation()

  const clearRequest = useAiTripStore((state) => state.clearRequest)

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

  const handleComplete = () => {
    router.push('/(tabs)/my-trips')
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <UnifiedTripCreator
      tripType={TRIP_TYPES.AI}
      steps={createAiTripSteps}
      theme={theme}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  )
}
