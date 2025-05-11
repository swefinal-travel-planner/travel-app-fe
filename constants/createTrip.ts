import ChooseLocation from '@/components/CreateTripComponents/ChooseLocation'
import SpotNumber from '@/components/CreateTripComponents/SpotNumber'
import SpotType from '@/components/CreateTripComponents/SpotType'
import TripLength from '@/components/CreateTripComponents/TripLength'

export const createManualTripSteps = [ChooseLocation, TripLength]

export const TRIP_TYPES = {
  MANUAL: 'MANUAL',
  AI: 'AI',
}

export const createAiTripSteps = [
  ChooseLocation,
  TripLength,
  SpotNumber,
  SpotType,
]

export const MAX_TRIP_LENGTH = 7
