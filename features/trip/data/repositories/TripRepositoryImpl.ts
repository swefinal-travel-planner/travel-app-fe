import beApi from '@/lib/beApi'
import { CreateTripDTO } from '../../domain/models/Trip'
import { UpdateTripItemDTO } from '../../domain/models/UpdateTripItemDTO'
import { TripRepository } from '../../domain/repositories/TripRepository'
import { TripImage } from '../../domain/models/TripImage'

export class TripRepositoryImpl implements TripRepository {
  async createTrip(trip: CreateTripDTO): Promise<number | null> {
    const response = await beApi.post('/trips', trip)
    return response.data.data.id ?? null
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
    if (!response.data.success) {
      throw new Error('Failed to post trip image')
    }
  }
}
