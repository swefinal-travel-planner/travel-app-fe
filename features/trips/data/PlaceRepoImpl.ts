import { Place } from '@/features/trips/domain/models/Place'
import {
  GetPlacesParams,
  PlaceRepository,
} from '../domain/repositories/IPlaceRepository'
import { PlaceApi } from '../infrastructure/api/PlaceApi'

export class PlaceRepoImpl implements PlaceRepository {
  async getPlaces(params: GetPlacesParams): Promise<Place[]> {
    return PlaceApi.getPlaces(params)
  }
}
