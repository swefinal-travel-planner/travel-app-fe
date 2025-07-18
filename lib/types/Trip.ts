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
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled' | null
  tripId: string | null
  tripItemId: string | null
}

export interface TripItem {
  timeSlot: string
  id: number
  orderInDay: number
  placeID: string
  placeInfo: PlaceInfo
  timeInDate: string
  tripDay: number
  tripID: number
  orderInTrip?: number // Thêm trường này để xác định thứ tự trong chuyến đi
  distance?: number | null // Khoảng cách từ điểm trước đó
  time?: number | null // Thời gian di chuyển từ điểm trước đó
}

export interface Trip {
  budget: number
  city: string
  days: number
  memberCount: number
  role: string
  startDate: string
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  title: string
  id: string
  image: string[]
  pinned: boolean
}
