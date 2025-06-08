import { CreateTripDTO, Trip } from '../../domain/models/Trip'
import { TripRepository } from '../../domain/repositories/TripRepository'

export class TripRepositoryImpl implements TripRepository {
  async createTrip(trip: CreateTripDTO): Promise<Trip> {
    const response = await apiClient.post<Trip>('/trips', trip)
    return response.data
  }
}
