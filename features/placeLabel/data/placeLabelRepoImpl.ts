import { PlaceLabel } from '../domain/models/PlaceLabel'
import { PlaceLabelRepository } from '../domain/repositories/IPlaceLabelRepository'
import { PlaceLabelApi } from '../infrastructure/api/PlaceLabelApi'

export class PlaceLabelRepoImpl implements PlaceLabelRepository {
  async getPlaceLabels({
    language,
  }: {
    language: string
  }): Promise<PlaceLabel> {
    return PlaceLabelApi.getPlaceLabels({ language })
  }
}
