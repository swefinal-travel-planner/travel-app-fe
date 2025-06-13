import { useState } from 'react'
import { TripRepositoryImpl } from '../../data/repositories/TripRepositoryImpl'
import { UpdateTripItemDTO } from '../../domain/models/UpdateTripItemDTO'
import { UpdateTripItemUseCase } from '../../domain/usecases/UpdateTripItemUseCase'

export const useUpdateTripItem = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateTripItemUseCase = new UpdateTripItemUseCase(
    new TripRepositoryImpl()
  )

  const updateTripItem = async (
    tripId: number,
    tripItems: UpdateTripItemDTO[]
  ): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await updateTripItemUseCase.execute(tripId, tripItems)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to update trip item')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateTripItem,
    isLoading,
    error,
  }
}
