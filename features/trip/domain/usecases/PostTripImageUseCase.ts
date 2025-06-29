import { TripRepository } from '../repositories/TripRepository'

export class PostTripImageUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(tripId: number, image: string): Promise<void> {
    if (!tripId || !image) {
      throw new Error('Trip ID and image are required')
    }
    await this.tripRepository.postTripImage(tripId, image)
  }
}
