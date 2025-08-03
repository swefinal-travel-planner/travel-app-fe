import { TripStep, TripType } from '@/constants/createTripSteps'
import { colorPalettes } from '@/constants/Itheme'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import beApi, { BE_URL } from '@/lib/beApi'
import { useAiTripStore } from '@/store/useAiTripStore'
import React, { useMemo, useState } from 'react'
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

  // Move the hook call to the top level
  const { updateTrip, isLoading: isUpdating, error: updateError } = useUpdateTrip()

  const getStore = useMemo(() => {
    return tripType === 'AI' ? aiTripStore : manualTripStore
  }, [tripType, aiTripStore, manualTripStore])

  const submitAiTrip = async () => {
    try {
      setIsSubmitting(true)

      const response = await beApi.post(`${BE_URL}/trips/ai`, useAiTripStore.getState().request)

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

  const updateManualTripTitle = async (title?: string) => {
    try {
      setIsSubmitting(true)
      const request = manualTripStore.request

      if (!request || !request.id) {
        throw new Error('No trip request data')
      }

      const isUpdated = await updateTrip({ title: title, id: request.id })

      if (!isUpdated) {
        Alert.alert('Error', 'Failed to create manual trip. Please try again.')
        return
      }

      manualTripStore.resetManualTrip()
      onComplete()
    } catch (error) {
      console.error('Manual trip creation error:', error)
      Alert.alert('Error', 'Failed to create manual trip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const handleSubmit = (title?: string) => {
    if (tripType === 'AI') {
      submitAiTrip()
      return
    }
    updateManualTripTitle(title)
  }

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
    backgroundColor: '#ffffff',
  },
})
