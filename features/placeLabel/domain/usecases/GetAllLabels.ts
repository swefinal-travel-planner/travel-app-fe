import { PlaceLabel } from '../models/PlaceLabel'
import { PlaceLabelRepository } from '../repositories/IPlaceLabelRepository'

export class GetAllLabels {
  private readonly placeLabelRepository: PlaceLabelRepository

  constructor(placeLabelRepository: PlaceLabelRepository) {
    this.placeLabelRepository = placeLabelRepository
  }

  async execute({ language }: { language: string }): Promise<PlaceLabel> {
    return this.placeLabelRepository.getPlaceLabels({ language })
  }
}
