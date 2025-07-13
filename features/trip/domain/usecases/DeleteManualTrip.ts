import { TripRepository } from '../repositories/TripRepository'

export class DeleteTripUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(tripId: number): Promise<boolean> {
    return this.tripRepository.deleteTrip(tripId)
  }
}
