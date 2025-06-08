import { CreateTripDTO, Trip } from '../models/Trip'
import { TripRepository } from '../repositories/TripRepository'

export class CreateManualTripUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(trip: CreateTripDTO): Promise<Trip> {
    return this.tripRepository.createTrip(trip)
  }
}
