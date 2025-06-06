import { Place } from '@/domain/models/Place'
import { PlaceRepository } from '../../domain/repositories/PlaceRepository'
import { PlaceApi } from '../datasources/PlaceApi'

export class PlaceRepoImpl implements PlaceRepository {
  async getPlaces(): Promise<Place[]> {
    return PlaceApi.getPlaces()
  }
}
