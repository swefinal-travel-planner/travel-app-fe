import { Place } from '../models/Place'
import {
  GetPlacesParams,
  PlaceRepository,
} from '../repositories/IPlaceRepository'

export class GetAllPlaces {
  private readonly placeRepository: PlaceRepository

  constructor(placeRepository: PlaceRepository) {
    this.placeRepository = placeRepository
  }

  async execute(params: GetPlacesParams): Promise<Place[]> {
    return this.placeRepository.getPlaces(params)
  }
}
