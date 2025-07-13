import { useQuery } from '@tanstack/react-query'
import { tripRepository } from '../../di/container'
import { GetTripImageUseCase } from '../../domain/usecases/GetTripImageUseCase'

export const useGetTripImages = (tripId: number) => {
  const getTripImageUseCase = new GetTripImageUseCase(tripRepository)

  const { data, isLoading, error } = useQuery({
    queryKey: ['tripImages', tripId],
    queryFn: () => {
      return getTripImageUseCase.execute(tripId).then((images) => {
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
