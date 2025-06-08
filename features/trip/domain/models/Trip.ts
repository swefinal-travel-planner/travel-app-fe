export const timeSlots = ['morning', 'afternoon', 'evening'] as const
export type TimeSlot = (typeof timeSlots)[number]

export type TripItem = {
  item_id: string
  name: string
  category?: string
  location?: string
  address?: string
  time_in_date: TimeSlot
  order_in_date?: number
  place_id?: string | null
}

export type Trip = {
  id?: string
  name: string
  startDate: Date
  numberOfDays: number
  location: string
  description?: string
  imageUrl?: string
  items: TripItem[]
}

export interface CreateTripDTO {
  name: string
  startDate: Date
  numberOfDays: number
  location: string
  description?: string
  imageUrl?: string
  items: TripItem[]
}

export type TripDate = {
  date: Date
}

export type PartialTripItem = Partial<TripItem>
