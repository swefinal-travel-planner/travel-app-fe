import { UpdateTripDTO } from '../models/Trip'
import { TripRepository } from '../repositories/TripRepository'

export class UpdateTripInfoUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(trip: UpdateTripDTO): Promise<number | null> {
    return this.tripRepository.updateTrip(trip)
  }
}
