import coreApi, { safeCoreApiCall } from '../../../../lib/coreApi'
import { PlaceLabel } from '../../domain/models/PlaceLabel'

export class PlaceLabelApi {
  static async getPlaceLabels({ language }: { language: string }): Promise<PlaceLabel> {
    try {
      const response = await safeCoreApiCall(() =>
        coreApi.get('/labels', {
          params: { language },
        })
      )

      // If response is null, it means it was a silent error
      if (!response) {
        throw new Error('Failed to fetch place labels')
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching place labels:', error)
      throw error
    }
  }
}
