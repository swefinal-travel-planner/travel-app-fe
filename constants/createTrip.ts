import FoodSpotType from '@/components/CreateTripComponents/FoodSpotType'
import LocPreference from '@/components/CreateTripComponents/LocPreference'
import MedicalReqs from '@/components/CreateTripComponents/MedicalReq'
import OtherReqs from '@/components/CreateTripComponents/OtherReq'
import SpotNumber from '@/components/CreateTripComponents/SpotNumber'
import SpotType from '@/components/CreateTripComponents/SpotType'
import TripRename from '@/components/CreateTripComponents/TripRename'
import WaitScreen from '@/components/CreateTripComponents/WaitScreen'
import ManualTripCreate from '@/features/trip/presentation/components/ManualTripCreate'
import TripLength from '@/features/trip/presentation/components/TripLength'
import ChooseLocation from '@/features/trip/presentation/components/TripLocation'

export const createManualTripSteps = [ChooseLocation, TripLength, ManualTripCreate, TripRename]

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
  LocPreference,
  TripRename,
  WaitScreen,
]

export const MAX_TRIP_LENGTH = 7
