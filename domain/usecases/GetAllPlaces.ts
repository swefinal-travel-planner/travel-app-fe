import { Place } from '../models/Place'
import { PlaceRepository } from '../repositories/PlaceRepository'

export class GetAllPlaces {
  private readonly placeRepository: PlaceRepository

  constructor(placeRepository: PlaceRepository) {
    this.placeRepository = placeRepository
  }

  async execute(): Promise<Place[]> {
    return this.placeRepository.getPlaces()
  }
}
