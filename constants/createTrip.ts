import ChooseLocation from '@/components/CreateTripComponents/ChooseLocation'
import FoodSpotType from '@/components/CreateTripComponents/FoodSpotType'
import ManualTripCreate from '@/components/CreateTripComponents/ManualTripCreate'
import MedicalReqs from '@/components/CreateTripComponents/MedicalReq'
import OtherReqs from '@/components/CreateTripComponents/OtherReq'
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
  FoodSpotType,
  MedicalReqs,
  OtherReqs,
]

export const MAX_TRIP_LENGTH = 7
