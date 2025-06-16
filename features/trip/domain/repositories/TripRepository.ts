import { CreateTripDTO } from '../models/Trip'
import { UpdateTripItemDTO } from '../models/UpdateTripItemDTO'

export type TripRepository = {
  createTrip(trip: CreateTripDTO): Promise<number | null>
  updateTripItems(tripId: number, tripItem: UpdateTripItemDTO[]): Promise<void>
}
