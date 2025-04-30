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
      imageUrl:
        'https://specials.priceless.com/mastercard/images/56fdaecb-989e-4db6-81b1-26b17a8d7bed.jpg',
    },
    {
      id: '2',
      name: 'Trip to New York',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2023-11-10'),
      location: 'New York, USA',
      description: 'Exploring the Big Apple.',
      imageUrl: '@/assets/images/wyndham.png',
    },
    {
      id: '3',
      name: 'Trip to Tokyo',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2023-12-10'),
      location: 'Tokyo, Japan',
      description: 'A cultural journey in Japan.',
      imageUrl:
        'https://specials.priceless.com/mastercard/images/56fdaecb-989e-4db6-81b1-26b17a8d7bed.jpg',
    },
    {
      id: '4',
      name: 'Trip to Sydney',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10'),
      location: 'Sydney, Australia',
      description: 'Discovering the land down under.',
      imageUrl:
        'https://specials.priceless.com/mastercard/images/56fdaecb-989e-4db6-81b1-26b17a8d7bed.jpg',
    },
  ]

  return Promise.resolve(tripsData)
}
