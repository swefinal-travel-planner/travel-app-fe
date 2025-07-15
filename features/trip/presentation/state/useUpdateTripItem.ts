import { UpdateTripItemUseCase } from './../../domain/usecases/UpdateTripItemUseCase'
import { useState } from 'react'
import { UpdateTripItemDTO } from '../../domain/models/UpdateTripItemDTO'
import { tripRepository } from '../../di/container'

export const useUpdateTripItem = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateTripItemUseCase = new UpdateTripItemUseCase(tripRepository)

  const updateTripItems = async (tripId: number, tripItems: UpdateTripItemDTO[]): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await updateTripItemUseCase.execute(tripId, tripItems)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update trip item'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateTripItems,
    isLoading,
    error,
  }
}
