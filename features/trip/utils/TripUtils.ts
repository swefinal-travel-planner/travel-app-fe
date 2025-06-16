import { TimeSlot, Trip, TripItem } from '../domain/models/Trip'
import { UpdateTripItemDTO } from '../domain/models/UpdateTripItemDTO'

export type TripItemsByDate = {
  [date: string]: {
    [timeSlot in TimeSlot]?: TripItem[]
  }
}

export const ensureAllDatesIncluded = (
  trip: Partial<Trip>,
  itemsByDate: TripItemsByDate
): TripItemsByDate => {
  if (!trip.startDate || !trip.days) {
    return itemsByDate
  }

  const startDate = new Date(trip.startDate)
  const result: TripItemsByDate = { ...itemsByDate }

  // Generate all dates for the trip
  for (let i = 0; i < trip.days; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const dateString = currentDate.toDateString()

    // If this date doesn't exist in itemsByDate, add it with empty time slots
    if (!result[dateString]) {
      result[dateString] = {
        morning: [],
        afternoon: [],
        evening: [],
      }
    }
  }

  return result
}

export const convertManualTripToDTO = (
  trip: Partial<Trip>,
  itemsByDate: TripItemsByDate
): UpdateTripItemDTO[] => {
  const result: UpdateTripItemDTO[] = []

  // Sort dates to ensure correct tripDay assignment
  const sortedDates = Object.keys(itemsByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  sortedDates.forEach((dateString, index) => {
    const dayItems = itemsByDate[dateString]
    const tripDay = index + 1

    // Process each time slot
    Object.entries(dayItems).forEach(([timeSlot, items]) => {
      if (items) {
        items.forEach((item: TripItem) => {
          result.push({
            orderInDay: item.orderInDay,
            placeID: item.placeID,
            timeInDate: timeSlot,
            tripDay,
          })
        })
      }
    })
  })

  return result
}
