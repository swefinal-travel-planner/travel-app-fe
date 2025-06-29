import { CreateTripDTO } from '../models/Trip'
import { TripImage } from '../models/TripImage'
import { UpdateTripItemDTO } from '../models/UpdateTripItemDTO'

export type TripRepository = {
  createTrip(trip: CreateTripDTO): Promise<number | null>
  updateTripItems(tripId: number, tripItem: UpdateTripItemDTO[]): Promise<void>
  getTripImage(tripId: number): Promise<TripImage[] | null>
  postTripImage(tripId: number, image: string): Promise<void>
}
