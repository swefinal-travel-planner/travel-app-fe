import { Place } from '../models/Place'

export interface PlaceRepository {
  getPlaces(): Promise<Place[]>
}
