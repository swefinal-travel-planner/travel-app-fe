import FoodSpotType from '@/features/trip/presentation/components/FoodSpotType'
import LocPreference from '@/features/trip/presentation/components/LocPreference'
import ManualTripCreate from '@/features/trip/presentation/components/ManualTripCreate'
import MedicalReqs from '@/features/trip/presentation/components/MedicalReq'
import OtherReqs from '@/features/trip/presentation/components/OtherReq'
import SpotNumber from '@/features/trip/presentation/components/SpotNumber'
import SpotType from '@/features/trip/presentation/components/SpotType'
import TripLength from '@/features/trip/presentation/components/TripLength'
import ChooseLocation from '@/features/trip/presentation/components/TripLocation'
import TripRename from '@/features/trip/presentation/components/TripRename'
import WaitScreen from '@/features/trip/presentation/components/WaitScreen'
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
