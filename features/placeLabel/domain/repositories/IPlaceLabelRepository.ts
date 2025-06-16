import { PlaceLabel } from '../models/PlaceLabel'

export type PlaceLabelRepository = {
  getPlaceLabels({ language }: { language: string }): Promise<PlaceLabel>
}
