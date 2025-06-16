import { Place } from '@/features/place/domain/models/Place'
import coreApi, { ENDPOINTS } from '../../../../lib/coreApi'
import { GetPlacesParams } from '../../../place/domain/repositories/IPlaceRepository'

export class PlaceApi {
  static async getPlaces(params: GetPlacesParams): Promise<Place[]> {
    try {
      const response = await coreApi.get(ENDPOINTS.PLACES.BASE, {
        params: {
          limit: params.limit,
          location: params.location,
          language: params.language,
          filter: params.filter,
          search_after_id: params.search_after_id,
        },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching places:', error)
      throw error
    }
  }

  static async getPlaceById(id: string): Promise<Place> {
    try {
      const response = await coreApi.get(ENDPOINTS.PLACES.BY_ID(id))
      return response.data
    } catch (error) {
      console.error('Error fetching place by id:', error)
      throw error
    }
  }
}
