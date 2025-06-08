import { useQuery } from '@tanstack/react-query'
import { PlaceRepoImpl } from '../../data/PlaceRepoImpl'
import { GetPlacesParams } from '../../domain/repositories/IPlaceRepository'
import { GetAllPlaces } from '../../domain/usecases/GetAllPlaces'

export const usePlaces = (params: GetPlacesParams) => {
  const getAllPlaces = new GetAllPlaces(new PlaceRepoImpl())

  const { data, isLoading, error } = useQuery({
    queryKey: ['places'],
    queryFn: () => getAllPlaces.execute(params),
  })

  return { data, isLoading, error }
}
