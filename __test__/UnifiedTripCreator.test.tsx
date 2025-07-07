import UnifiedTripCreator from '@/components/CreateTripComponents/UnifiedTripCreator'
import { createAiTripSteps, createManualTripSteps, TRIP_TYPES } from '@/constants/createTrip'
import { colorPalettes } from '@/constants/Itheme'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

// Mock the stores
jest.mock('@/store/useAiTripStore', () => ({
  useAiTripStore: jest.fn(() => ({
    request: {
      title: 'Test AI Trip',
      city: 'Hanoi',
      startDate: '2024-01-01',
      days: 3,
      budget: 1000,
      locationsPerDay: 3,
      locationPreference: 'balanced',
      enFoodAttributes: [],
      viFoodAttributes: [],
      enLocationAttributes: [],
      viLocationAttributes: [],
      enMedicalConditions: [],
      viMedicalConditions: [],
      enSpecialRequirements: [],
      viSpecialRequirements: [],
    },
    setRequest: jest.fn(),
    clearRequest: jest.fn(),
  })),
}))

jest.mock('@/features/trip/presentation/state/useManualTrip', () => ({
  useManualTripStore: jest.fn(() => ({
    request: {
      title: 'Test Manual Trip',
      city: 'Ho Chi Minh',
      startDate: '2024-01-01',
      days: 2,
      budget: 500,
      locationsPerDay: 2,
      locationPreference: 'proximity',
      enFoodAttributes: [],
      viFoodAttributes: [],
      enLocationAttributes: [],
      viLocationAttributes: [],
      enMedicalConditions: [],
      viMedicalConditions: [],
      enSpecialRequirements: [],
      viSpecialRequirements: [],
    },
    setRequest: jest.fn(),
    resetManualTrip: jest.fn(),
    itemsByDate: {},
  })),
}))

// Mock the API
jest.mock('@/lib/beApi', () => ({
  beApi: {
    post: jest.fn(),
  },
  BE_URL: 'http://localhost:3000',
  safeApiCall: jest.fn((fn) => fn()),
}))

describe('UnifiedTripCreator', () => {
  const mockTheme = colorPalettes.light
  const mockOnComplete = jest.fn()
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders AI trip creator correctly', () => {
    const { getByText } = render(
      <UnifiedTripCreator
        tripType={TRIP_TYPES.AI}
        steps={createAiTripSteps}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Should render the first step (ChooseLocation)
    expect(getByText('Where would you like to go?')).toBeTruthy()
  })

  it('renders Manual trip creator correctly', () => {
    const { getByText } = render(
      <UnifiedTripCreator
        tripType={TRIP_TYPES.MANUAL}
        steps={createManualTripSteps}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Should render the first step (ChooseLocation)
    expect(getByText('Where would you like to go?')).toBeTruthy()
  })

  it('handles navigation between steps', async () => {
    const { getByText } = render(
      <UnifiedTripCreator
        tripType={TRIP_TYPES.AI}
        steps={createAiTripSteps}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Find and press the Next button
    const nextButton = getByText('Next')
    fireEvent.press(nextButton)

    // Should navigate to the next step
    await waitFor(() => {
      expect(getByText('How many days?')).toBeTruthy()
    })
  })

  it('calls onBack when back button is pressed on first step', () => {
    const { getByTestId } = render(
      <UnifiedTripCreator
        tripType={TRIP_TYPES.AI}
        steps={createAiTripSteps}
        theme={mockTheme}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Simulate back button press
    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)

    expect(mockOnBack).toHaveBeenCalled()
  })
})
