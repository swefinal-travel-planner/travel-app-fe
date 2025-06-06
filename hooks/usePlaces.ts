import { PlaceApi } from '@/data/datasources/PlaceApi'
import { Place } from '@/domain/models/Place'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

interface GetPlacesParams {
  limit?: number
  location?: string
  language?: string
  filter?: string
  search_after_id?: string
}

export const QUERY_KEYS = {
  places: (params: GetPlacesParams = {}) => ['places', params] as const,
  place: (id: string) => ['place', id] as const,
}

export function usePlaces(
  params: GetPlacesParams = {
    limit: 1,
    location: 'Ho Chi Minh',
    language: 'en',
  },
  options?: Omit<UseQueryOptions<Place[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Place[], Error>({
    queryKey: QUERY_KEYS.places(params),
    queryFn: () => PlaceApi.getPlaces(params),
    ...options,
  })
}

export function usePlaceById(
  id: string,
  options?: Omit<
    UseQueryOptions<Place, Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) {
  return useQuery<Place, Error>({
    queryKey: QUERY_KEYS.place(id),
    queryFn: () => PlaceApi.getPlaceById(id),
    enabled: !!id,
    ...options,
  })
}
