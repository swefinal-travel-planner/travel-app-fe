import coreApi, { ENDPOINTS } from '../../../../lib/coreApi'
import { PlaceLabel } from '../../domain/models/PlaceLabel'

export class PlaceLabelApi {
  static async getPlaceLabels({ language }: { language: string }): Promise<PlaceLabel> {
    try {
      const response = await coreApi.get(ENDPOINTS.LABELS.BASE, {
        params: { language },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching place labels:', error)
      throw error
    }
  }
}
