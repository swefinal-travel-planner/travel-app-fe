import { useState } from 'react'
import { tripRepository } from '../../di/container'
import { UpdateTripDTO } from '../../domain/models/Trip'
import { UpdateTripInfoUseCase } from './../../domain/usecases/UpdateTripInfoUseCase'

export const useUpdateTrip = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateTripInfoUseCase = new UpdateTripInfoUseCase(tripRepository)

  const updateTrip = async (trip: UpdateTripDTO): Promise<boolean> => {
    console.log(trip, 'trip')
    setIsLoading(true)
    setError(null)
    try {
      return await updateTripInfoUseCase.execute(trip)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update trip'))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateTrip,
    isLoading,
    error,
  }
}
