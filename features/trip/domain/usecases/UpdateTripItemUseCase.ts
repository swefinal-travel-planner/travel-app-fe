import { UpdateTripItemDTO } from '../models/UpdateTripItemDTO'
import { TripRepository } from '../repositories/TripRepository'

export class UpdateTripItemUseCase {
  constructor(private readonly tripRepository: TripRepository) {}

  async execute(tripId: number, tripItems: UpdateTripItemDTO[]): Promise<void> {
    return this.tripRepository.updateTripItems(tripId, tripItems)
  }
}
