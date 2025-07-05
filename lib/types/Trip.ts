interface Trip2 {
  id: string
  image: string
  title: string
  city: string
  start_date: string
  days: number
  budget: number
  numMembers: number
  location_attributes: string[]
  food_attributes: string[]
  special_requirements: string[]
  medical_conditions: string[]
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  pinned: boolean
}

interface Location {
  lat: number
  long: number
}

interface PlaceInfo {
  address: string
  id: number
  images: string[]
  location: Location
  name: string
  properties: string[]
  type: string
}

export interface TripItem {
  id: number
  orderInDay: number
  placeID: string
  placeInfo: PlaceInfo
  timeInDate: string
  tripDay: number
  tripID: number
  orderInTrip?: number // Thêm trường này để xác định thứ tự trong chuyến đi
}

export interface Trip {
  budget: number
  city: string
  days: number
  numMembers: number
  role: string
  startDate: string
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  title: string
  id: string
  image: string[]
  pinned: boolean
}
