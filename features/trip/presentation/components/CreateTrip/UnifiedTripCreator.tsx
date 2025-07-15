import { TripStep, TripType } from '@/constants/createTripSteps'
import { colorPalettes } from '@/constants/Itheme'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import beApi, { BE_URL, safeBeApiCall } from '@/lib/beApi'
import { useAiTripStore } from '@/store/useAiTripStore'
import React, { useCallback, useMemo, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'
import { useUpdateTrip } from '../../state/useUpdateTrip'
import CreateTripNavigationBar from './CreateTripNavigationBar'

interface UnifiedTripCreatorProps {
  tripType: TripType
  steps: TripStep[]
  theme: typeof colorPalettes.light
  onComplete: () => void
  onBack: () => void
}

export default function UnifiedTripCreator({
  tripType,
  steps,
  theme,
  onComplete,
  onBack,
}: Readonly<UnifiedTripCreatorProps>) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const StepComponent = steps[currentStep].component
  const isLastStep = steps[currentStep].isLastStep

  // Get store based on trip type
  const aiTripStore = useAiTripStore()
  const manualTripStore = useManualTripStore()

  const getStore = useMemo(() => {
    return tripType === 'AI' ? aiTripStore : manualTripStore
  }, [tripType, aiTripStore, manualTripStore])

  const submitAiTrip = async () => {
    try {
      setIsSubmitting(true)

      const response = await safeBeApiCall(() => beApi.post(`${BE_URL}/trips/ai`, useAiTripStore.getState().request))

      if (!response) {
        Alert.alert('Error', 'Failed to create AI trip. Please try again.')
        return
      }

      aiTripStore.clearRequest()
    } catch (error) {
      console.error('AI trip creation error:', error)
      Alert.alert('Error', 'Failed to create AI trip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitManualTrip = useCallback(async () => {
    try {
      setIsSubmitting(true)
      const request = manualTripStore.request
      const resetManualTrip = manualTripStore.resetManualTrip

      if (!request) {
        throw new Error('No trip request data')
      }
      if (!request.title) {
        Alert.alert('Error', 'Trip title is missing.')
        return
      }
      const payload = {
        ...request,
      }

      const { updateTrip, isLoading: isUpdating, error: updateError } = useUpdateTrip()
      const response = await updateTrip({ title: payload.title, id: payload.id ? payload.id : 0 })

      if (!response) {
        Alert.alert('Error', 'Failed to create manual trip. Please try again.')
        return
      }

      resetManualTrip()
      onComplete()
    } catch (error) {
      console.error('Manual trip creation error:', error)
      Alert.alert('Error', 'Failed to create manual trip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [manualTripStore, onComplete])

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, steps.length])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }, [currentStep, onBack])

  const handleSubmit = useCallback(() => {
    if (tripType === 'AI') {
      submitAiTrip()
      return
    }
    submitManualTrip()
  }, [tripType, submitAiTrip, submitManualTrip])

  return (
    <View style={styles.container}>
      <CreateTripNavigationBar
        type={tripType}
        theme={theme}
        goback={handleBack}
        currentStep={currentStep}
        isLastStep={isLastStep}
      />
      <StepComponent
        theme={theme}
        nextFn={handleNext}
        setTripState={getStore.setRequest}
        getTripState={getStore.request}
        onSubmit={isLastStep ? handleSubmit : undefined}
        isSubmitting={isSubmitting}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 40,
    paddingBottom: 20,
  },
})
