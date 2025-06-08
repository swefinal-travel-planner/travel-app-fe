import { useInfiniteQuery } from '@tanstack/react-query'
import { PlaceRepoImpl } from '../../data/PlaceRepoImpl'
import { Place } from '../../domain/models/Place'
import { GetPlacesParams } from '../../domain/repositories/IPlaceRepository'
import { GetAllPlaces } from '../../domain/usecases/GetAllPlaces'

interface UsePlacesParams extends GetPlacesParams {
  enabled?: boolean
}

export const usePlaces = (params: UsePlacesParams) => {
  const { enabled = true, ...queryParams } = params
  const getAllPlaces = new GetAllPlaces(new PlaceRepoImpl())

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['places', queryParams],
    queryFn: async ({ pageParam }) => {
      const result = await getAllPlaces.execute({
        ...queryParams,
        search_after_id: pageParam,
      })
      return result
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: Place[]) => {
      if (lastPage.length < params.limit) {
        return undefined // No more pages
      }
      return lastPage[lastPage.length - 1]?.id // Use the last item's ID
    },
    enabled,
  })

  const places = data?.pages.flat() || []

  return {
    data: places,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}
