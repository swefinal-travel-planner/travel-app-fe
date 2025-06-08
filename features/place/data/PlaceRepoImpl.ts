import { Place } from '@/features/place/domain/models/Place'
import { PlaceApi } from '../infrastructure/api/PlaceApi'
import {
  GetPlacesParams,
  PlaceRepository,
} from '../domain/repositories/IPlaceRepository'

export class PlaceRepoImpl implements PlaceRepository {
  async getPlaces(params: GetPlacesParams): Promise<Place[]> {
    return PlaceApi.getPlaces(params)
  }
}
