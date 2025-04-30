import { ITrip } from '@/types/Trip/Trip'

export function apiGetTrips(query: string): Promise<ITrip[]> {
  const tripsData: ITrip[] = [
    {
      id: '1',
      name: 'Trip to Paris',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-10-10'),
      location: 'Paris, France',
      description: 'A wonderful trip to the city of lights.',
      imageUrl: '@/assets/images/wyndham.png',
    },
    {
      id: '2',
      name: 'Trip to New York',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2023-11-10'),
      location: 'New York, USA',
      description: 'Exploring the Big Apple.',
      imageUrl: 'https://example.com/newyork.jpg',
    },
  ]

  return Promise.resolve(tripsData)
}
