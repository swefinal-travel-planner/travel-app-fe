import ChooseLocation from '@/components/CreateTripComponents/ChooseLocation'
import ManualTripCreate from '@/components/CreateTripComponents/ManualTripCreate'
import SpotNumber from '@/components/CreateTripComponents/SpotNumber'
import SpotType from '@/components/CreateTripComponents/SpotType'
import TripLength from '@/components/CreateTripComponents/TripLength'

export const createManualTripSteps = [
  ChooseLocation,
  TripLength,
  ManualTripCreate,
]

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
