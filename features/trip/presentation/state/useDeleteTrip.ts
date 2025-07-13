import { useState } from 'react'
import { DeleteTripUseCase } from '../../domain/usecases/DeleteManualTrip'
import { tripRepository } from '../../di/container'

export const useDeleteTrip = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteTripUseCase = new DeleteTripUseCase(tripRepository)

  const deleteTrip = async (tripId: number): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const deletedTrip = await deleteTripUseCase.execute(tripId)
      return deletedTrip
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete trip'))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteTrip,
    isLoading,
    error,
  }
}
