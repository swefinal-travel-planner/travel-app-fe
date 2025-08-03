import { colorPalettes } from '@/constants/Itheme'
import { Place } from '@/features/place/domain/models/Place'
import { TimeSlot } from '@/features/trip/domain/models/Trip'

export type AddPlaceModalProps = {
  visible: boolean
  selectedTime: TimeSlot | null
  onClose: () => void
  onConfirm: (places: Place[]) => void
}

export type PlaceItemProps = {
  place: Place
  isSelected: boolean
  onToggle: (place: Place) => void
  theme: typeof colorPalettes.light
}

export type ModalHeaderProps = {
  selectedTime: TimeSlot | null
  onFilterPress: () => void
  theme: typeof colorPalettes.light
}

export type ModalFooterProps = {
  selectedCount: number
  onCancel: () => void
  onDone: () => void
  theme: typeof colorPalettes.light
}

export type LoadingStateProps = {
  theme: typeof colorPalettes.light
}

export type ErrorStateProps = {
  error: Error
  theme: typeof colorPalettes.light
}

export type LoadingFooterProps = {
  theme: typeof colorPalettes.light
}
