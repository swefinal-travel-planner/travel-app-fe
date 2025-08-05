import UpdateManualTrip from '@/features/trip/presentation/components/CreateTrip/Manual/UpdateManualTrip'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

// Mock the hooks and dependencies
jest.mock('@/hooks/useThemeStyle', () => ({
  useThemeStyle: () => ({
    white: '#ffffff',
    primary: '#007AFF',
    error: '#FF3B30',
  }),
}))

jest.mock('@/hooks/useTripDetails', () => ({
  useTripDetails: () => ({
    trip: null,
    tripItems: [],
    groupedItems: [],
    loading: false,
  }),
}))

jest.mock('@/features/trip/presentation/state/useCreateTrip', () => ({
  useCreateTrip: () => ({
    createTrip: jest.fn(),
    isLoading: false,
    error: null,
  }),
}))

jest.mock('@/features/trip/presentation/state/useUpdateTripItem', () => ({
  useUpdateTripItem: () => ({
    updateTripItems: jest.fn(),
    isLoading: false,
    error: null,
  }),
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}))

describe('UpdateManualTrip', () => {
  beforeEach(() => {
    // Reset the store before each test
    useManualTripStore.getState().resetManualTrip()
  })

  it('should show validation error when trying to submit without any items', async () => {
    const { getByText } = render(<UpdateManualTrip mode="create" />)

    // Set a start date but no items
    useManualTripStore.getState().setRequest({
      startDate: new Date('2024-01-01'),
      title: 'Test Trip',
      city: 'Test City',
      days: 1,
    })

    // Try to submit
    const submitButton = getByText('Next')
    fireEvent.press(submitButton)

    // Should show validation error
    await waitFor(() => {
      expect(getByText('Please add at least one place to your trip before proceeding')).toBeTruthy()
    })
  })

  it('should allow submission when items are present', async () => {
    const { getByText, queryByText } = render(<UpdateManualTrip mode="create" />)

    // Set a start date
    useManualTripStore.getState().setRequest({
      startDate: new Date('2024-01-01'),
      title: 'Test Trip',
      city: 'Test City',
      days: 1,
    })

    // Add an item
    const testDate = new Date('2024-01-01')
    useManualTripStore.getState().addTripItems(
      [
        {
          item_id: '1',
          title: 'Test Place',
          category: 'restaurant',
          location: 'Test Location',
          address: 'Test Address',
          tripDay: 1,
          timeInDate: 'morning',
          orderInDay: 1,
          placeID: '1',
          type: 'item',
        },
      ],
      testDate
    )

    // Try to submit
    const submitButton = getByText('Next')
    fireEvent.press(submitButton)

    // Should not show validation error
    await waitFor(() => {
      expect(queryByText('Please add at least one place to your trip before proceeding')).toBeNull()
    })
  })

  it('should clear validation error when items are added', async () => {
    const { getByText, queryByText } = render(<UpdateManualTrip mode="create" />)

    // Set a start date but no items
    useManualTripStore.getState().setRequest({
      startDate: new Date('2024-01-01'),
      title: 'Test Trip',
      city: 'Test City',
      days: 1,
    })

    // Try to submit - should show error
    const submitButton = getByText('Next')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('Please add at least one place to your trip before proceeding')).toBeTruthy()
    })

    // Add an item
    const testDate = new Date('2024-01-01')
    useManualTripStore.getState().addTripItems(
      [
        {
          item_id: '1',
          title: 'Test Place',
          category: 'restaurant',
          location: 'Test Location',
          address: 'Test Address',
          tripDay: 1,
          timeInDate: 'morning',
          orderInDay: 1,
          placeID: '1',
          type: 'item',
        },
      ],
      testDate
    )

    // Error should be cleared
    await waitFor(() => {
      expect(queryByText('Please add at least one place to your trip before proceeding')).toBeNull()
    })
  })
})
