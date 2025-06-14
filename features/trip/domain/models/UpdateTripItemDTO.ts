export type UpdateTripItemDTO = {
  orderInDay: number
  placeID: string
  timeInDate: string // Should match the TimeSlot type
  tripDay: number // Represents the day of the trip, starting from 1
}
