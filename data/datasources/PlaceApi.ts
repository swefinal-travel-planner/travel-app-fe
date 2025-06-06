import { Place } from '@/domain/models/Place'
import api, { ENDPOINTS } from './coreApi'

interface GetPlacesParams {
  limit?: number
  location?: string
  language?: string
  filter?: string
  search_after_id?: string
}

export class PlaceApi {
  static async getPlaces(
    params: GetPlacesParams = {
      limit: 1,
      location: 'Ho Chi Minh',
      language: 'en',
    }
  ): Promise<Place[]> {
    try {
      const response = await api.get(ENDPOINTS.PLACES.BASE, {
        params: {
          limit: params.limit,
          location: params.location,
          language: params.language,
          filter: params.filter,
          search_after_id: params.search_after_id,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching places:', error)
      throw error
    }
  }

  static async getPlaceById(id: string): Promise<Place> {
    try {
      const response = await api.get(ENDPOINTS.PLACES.BY_ID(id))
      return response.data
    } catch (error) {
      console.error('Error fetching place by id:', error)
      throw error
    }
  }
}
