import { useQuery } from '@tanstack/react-query'
import { TripRepositoryImpl } from '../../data/repositories/TripRepositoryImpl'
import { GetTripImageUseCase } from '../../domain/usecases/GetTripImageUseCase'

export const useGetTripImages = (tripId: number) => {
  const getTripImageUseCase = new GetTripImageUseCase(new TripRepositoryImpl())

  const { data, isLoading, error } = useQuery({
    queryKey: ['tripImages', tripId],
    queryFn: () => {
      return getTripImageUseCase.execute(tripId).then((images) => {
        if (!images) {
          throw new Error('No images found for this trip')
        }
        return images
      })
    },
    enabled: !!tripId,
  })

  return {
    tripImages: data || [],
    isLoading,
    error,
  }
}
