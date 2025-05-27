export type Trip = {
  id: string
  name: string
  startDate: Date
  numberOfDays: number
  location: string
  description: string
  imageUrl: string
  days: TripDate[]
  items: TripItem[]
}

export type TripDate = {
  date: Date
  timeInDate: TimeInDate
}

export type TimeSlot = 'morning' | 'midday' | 'afternoon' | 'evening'

export type TimeInDate = {
  time: TimeSlot
  items: TripItem[]
}

export interface TripItem {
  id: string
  name: string
  category: string
  location: string
  address?: string
}
