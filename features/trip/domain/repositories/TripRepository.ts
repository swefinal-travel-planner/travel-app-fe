import { CreateTripDTO, Trip } from '../models/Trip'

export type TripRepository = {
  createTrip(trip: CreateTripDTO): Promise<Trip>
}
