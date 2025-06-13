import beApi from '@/lib/beApi'
import { CreateTripDTO } from '../../domain/models/Trip'
import { TripRepository } from '../../domain/repositories/TripRepository'
import { UpdateTripItemDTO } from '../../domain/models/UpdateTripItemDTO'

export class TripRepositoryImpl implements TripRepository {
  async createTrip(trip: CreateTripDTO): Promise<number | null> {
    const response = await beApi.post('/trips', trip)
    return response.data.data.id ?? null
  }

  async updateTripItems(
    tripId: number,
    tripItems: UpdateTripItemDTO[]
  ): Promise<void> {
    const response = await beApi.post(`/trips/${tripId}/items`, {
      tripItems,
    })
    if (!response.data.success) {
      throw new Error('Failed to update trip items')
    }
  }
}
