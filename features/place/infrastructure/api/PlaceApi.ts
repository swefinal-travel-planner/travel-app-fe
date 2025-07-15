import { Place } from '@/features/place/domain/models/Place'
import coreApi, { ENDPOINTS, safeCoreApiCall } from '../../../../lib/coreApi'
import { GetPlacesParams } from '../../../place/domain/repositories/IPlaceRepository'

export class PlaceApi {
  static async getPlaces(params: GetPlacesParams): Promise<Place[]> {
    try {
      const response = await safeCoreApiCall(() =>
        coreApi.get('/places', {
          params: {
            limit: params.limit,
            location: params.location,
            language: params.language,
            filter: params.filter,
            search_after_id: params.search_after_id,
          },
        })
      )

      // If response is null, it means it was a silent error
      if (!response) {
        return []
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching places:', error)
      throw error
    }
  }

  static async getPlaceById(id: string): Promise<Place> {
    try {
      const response = await safeCoreApiCall(() => coreApi.get(`places/${id}`))

      // If response is null, it means it was a silent error
      if (!response) {
        throw new Error('Failed to fetch place')
      }

      return response.data
    } catch (error) {
      console.error('Error fetching place by id:', error)
      throw error
    }
  }
}
