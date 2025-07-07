import UnifiedTripCreator from '@/components/CreateTripComponents/UnifiedTripCreator'
import { createManualTripSteps, TRIP_TYPES } from '@/constants/createTrip'
import { colorPalettes } from '@/constants/Itheme'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'

export default function ManualCreateTripScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
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
    <View style={styles.safeAreaContainer}>
      <UnifiedTripCreator
        tripType={TRIP_TYPES.MANUAL}
        steps={createManualTripSteps}
        theme={theme}
        onComplete={handleComplete}
        onBack={handleBack}
      />
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
  })
