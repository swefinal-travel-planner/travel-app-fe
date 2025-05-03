import ChooseLocation from '@/components/CreateTripComponents/ChooseLocation'
import SpotNumber from '@/components/CreateTripComponents/SpotNumber'
import SpotType from '@/components/CreateTripComponents/SpotType'
import TripLength from '@/components/CreateTripComponents/TripLength'

export const createManualTripSteps = [ChooseLocation, TripLength]

export const createAiTripSteps = [
  ChooseLocation,
  TripLength,
  SpotNumber,
  SpotType,
]
