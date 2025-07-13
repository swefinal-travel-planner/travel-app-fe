import FoodSpotType from '@/features/trip/presentation/components/CreateTrip/AI/FoodSpotType'
import LocPreference from '@/features/trip/presentation/components/CreateTrip/AI/LocPreference'
import MedicalReqs from '@/features/trip/presentation/components/CreateTrip/AI/MedicalReq'
import OtherReqs from '@/features/trip/presentation/components/CreateTrip/AI/OtherReq'
import ManualTripCreate from '@/features/trip/presentation/components/CreateTrip/ManualTripCreate'
import SpotNumber from '@/features/trip/presentation/components/CreateTrip/SpotNumber'
import SpotType from '@/features/trip/presentation/components/CreateTrip/SpotType'
import TripLength from '@/features/trip/presentation/components/CreateTrip/TripLength'
import ChooseLocation from '@/features/trip/presentation/components/CreateTrip/TripLocation'
import TripRename from '@/features/trip/presentation/components/CreateTrip/TripRename'
import WaitScreen from '@/features/trip/presentation/components/CreateTrip/WaitScreen'
import { ComponentType } from 'react'

export const TRIP_TYPES = {
  MANUAL: 'MANUAL',
  AI: 'AI',
} as const

export type TripType = keyof typeof TRIP_TYPES

// Base step interface
export interface TripStep {
  component: ComponentType<any>
  isLastStep?: boolean
}

// AI Trip Steps
export const createAiTripSteps: TripStep[] = [
  { component: ChooseLocation },
  { component: TripLength },
  { component: SpotNumber },
  { component: SpotType },
  { component: FoodSpotType },
  { component: MedicalReqs },
  { component: OtherReqs },
  { component: LocPreference },
  {
    component: TripRename,
    isLastStep: true,
  },
  { component: WaitScreen },
]

// Manual Trip Steps
export const createManualTripSteps: TripStep[] = [
  { component: ChooseLocation },
  { component: TripLength },
  { component: ManualTripCreate },
  {
    component: TripRename,
    isLastStep: true,
  },
]

export const MAX_TRIP_LENGTH = 7
