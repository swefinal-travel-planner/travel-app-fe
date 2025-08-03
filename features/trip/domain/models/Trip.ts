export const timeSlots = ['morning', 'afternoon', 'evening'] as const
export type TimeSlot = (typeof timeSlots)[number]

export type TripItem = {
  item_id: string
  title: string
  category?: string
  location?: string
  address?: string
  tripDay?: number // Represents the day of the trip, starting from 1
  timeInDate: TimeSlot
  orderInDay: number
  placeID: string
}

export type Trip = {
  id?: number
  title: string
  startDate: Date
  days: number
  location: string
  description?: string
  imageUrl?: string
  items: TripItem[]
}

export type CreateTripDTO = {
  city: string
  days?: number
  startDate?: Date
  title?: string
}

export type UpdateTripDTO = Partial<CreateTripDTO> & {
  id: number
}

export type TripDate = {
  date: Date
}

export type PartialTripItem = Partial<TripItem>
