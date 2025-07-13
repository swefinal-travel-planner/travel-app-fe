import beApi, { safeBeApiCall } from '@/lib/beApi'
import coreApi, { safeCoreApiCall } from '@/lib/coreApi'
import { Trip, TripItem } from '@/lib/types/Trip'
import { formatDate } from '@/utils/Datetime'
import { useEffect, useState } from 'react'

type DistanceTime = {
  distance: string
  time: string
}

type GroupedItem = {
  day: number
  date: string
  spots: any[]
}

export const useTripDetails = (tripId: string) => {
  const [trip, setTrip] = useState<Trip>()
  const [tripItems, setTripItems] = useState<TripItem[]>([])
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([])
  const [distanceTimes, setDistanceTimes] = useState<DistanceTime[]>([])
  const [activeDay, setActiveDay] = useState(0)
  const [loading, setLoading] = useState(true)

  const getTripDetail = async () => {
    try {
      const tripData = await safeBeApiCall(() => beApi.get(`/trips/${tripId}`))
      setTrip(tripData.data.data)
    } catch (error) {
      console.error('Error fetching trip detail by ID:', error)
    }
  }

  const getTripItems = async () => {
    try {
      const tripItemData = await beApi.get(`/trips/${tripId}/trip-items?language=en`)

      // Check if the response data is null or undefined
      if (!tripItemData.data?.data) {
        console.warn('No trip items data received from API')
        setTripItems([])
        setDistanceTimes([])
        setGroupedItems([])
        return
      }

      let items: TripItem[] = tripItemData.data.data

      // Check if items array is empty
      if (!items || items.length === 0) {
        console.warn('No trip items found')
        setTripItems([])
        setDistanceTimes([])
        setGroupedItems([])
        return
      }

      const placeIDs = items.map((item) => item.placeID)

      items = items.map((item, index) => ({
        ...item,
        orderInTrip: index,
      }))

      setTripItems(items)

      // Get distance and time information
      const distanceTimeData = await safeCoreApiCall(() => coreApi.post(`/distance_time/calc`, { place_ids: placeIDs }))

      if (!distanceTimeData) {
        setDistanceTimes([])
        return
      }

      setDistanceTimes(
        distanceTimeData.data.data.map((item: any) => ({
          distance: item.distance,
          time: item.time,
        }))
      )

      // Group items by day
      const start = trip?.startDate ? new Date(trip.startDate) : new Date()

      const grouped: { [day: number]: TripItem[] } = {}
      items.forEach((item) => {
        if (!grouped[item.tripDay]) grouped[item.tripDay] = []
        grouped[item.tripDay].push(item)
      })

      const groupedList = Object.entries(grouped)
        .map(([dayStr, items]) => {
          const day = parseInt(dayStr)
          const currentDate = new Date(start)
          currentDate.setDate(start.getDate() + day - 1)

          return {
            day,
            date: formatDate(currentDate),
            spots: items
              .sort((a, b) => a.orderInDay - b.orderInDay)
              .map((spot) => ({
                id: spot.placeID,
                tripDay: spot.tripDay,
                name: spot.placeInfo?.name ?? 'Unknown',
                address: spot.placeInfo?.address ?? 'Unknown address',
                image: { uri: spot.placeInfo?.images?.[0] ?? '' },
                timeSlot: spot.timeInDate,
                orderInTrip: spot.orderInTrip,
                orderInDay: spot.orderInDay,
              })),
          }
        })
        .sort((a, b) => a.day - b.day)

      setGroupedItems(groupedList)
    } catch (error) {
      console.error('Error fetching trip items:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToPreviousDay = () => {
    if (activeDay > 0) {
      setActiveDay(activeDay - 1)
    }
  }

  const goToNextDay = () => {
    if (activeDay < groupedItems.length - 1) {
      setActiveDay(activeDay + 1)
    }
  }

  useEffect(() => {
    getTripDetail()
  }, [tripId])

  useEffect(() => {
    if (trip) {
      getTripItems()
    }
  }, [trip])

  return {
    trip,
    tripItems,
    groupedItems,
    distanceTimes,
    activeDay,
    loading,
    goToPreviousDay,
    goToNextDay,
  }
}
