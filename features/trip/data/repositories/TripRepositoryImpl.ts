import beApi from '@/lib/beApi'
import { CreateTripDTO, UpdateTripDTO } from '../../domain/models/Trip'
import { TripImage } from '../../domain/models/TripImage'
import { UpdateTripItemDTO } from '../../domain/models/UpdateTripItemDTO'
import { TripRepository } from '../../domain/repositories/TripRepository'

export class TripRepositoryImpl implements TripRepository {
  async createTrip(trip: CreateTripDTO): Promise<number | null> {
    const response = await beApi.post('/trips', trip)
    return response.data.data.id ?? null
  }

  async updateTrip(trip: UpdateTripDTO): Promise<boolean> {
    const response = await beApi.patch(`/trips/${trip.id}`, trip)
    return response.status === 204
  }

  async updateTripItems(tripId: number, tripItems: UpdateTripItemDTO[]): Promise<void> {
    // log the request for debugging
    console.log('Updating trip items:', { tripId, tripItems })

    const response = await beApi.post(`/trips/${tripId}/trip-items`, tripItems)
    if (!response.data.success) {
      throw new Error('Failed to update trip items')
    }
  }

  async getTripImage(tripId: number): Promise<TripImage[] | null> {
    const response = await beApi.get(`/trips/${tripId}/images`)
    if (response.data.success) {
      return response.data.data ?? null
    }
    return null
  }

  async postTripImage(tripId: number, image: string): Promise<void> {
    const response = await beApi.post(`/trips/${tripId}/images`, { imageUrl: image })

    if (response.status !== 204) {
      throw new Error('Failed to post trip image')
    }
  }

  async deleteTrip(tripId: number): Promise<boolean> {
    const response = await beApi.delete(`/trips/${tripId}`)

    if (response.status !== 204) {
      throw new Error('Failed to delete trip')
    }
    return true
  }
}
