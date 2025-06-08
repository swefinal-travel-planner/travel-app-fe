import { Place } from '../models/Place'

export type GetPlacesParams = {
  limit: number
  location: string
  language: string
  filter?: string
  search_after_id?: string
}

export type PlaceRepository = {
  getPlaces(params: GetPlacesParams): Promise<Place[]>
}
