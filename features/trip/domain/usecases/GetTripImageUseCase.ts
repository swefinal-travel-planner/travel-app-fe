import { TripImage } from '../models/TripImage'
import { TripRepository } from '../repositories/TripRepository'

export class GetTripImageUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(tripId: number): Promise<TripImage[] | null> {
    return this.tripRepository.getTripImage(tripId)
  }
}
