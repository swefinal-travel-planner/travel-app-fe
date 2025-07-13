import { useState } from 'react'
import { CreateTripDTO } from '../../domain/models/Trip'
import { CreateManualTripUseCase } from '../../domain/usecases/CreateManualTrip'
import { tripRepository } from '../../di/container'

export const useCreateTrip = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createManualTripUseCase = new CreateManualTripUseCase(tripRepository)

  const createTrip = async (trip: CreateTripDTO): Promise<number | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const createdTrip = await createManualTripUseCase.execute(trip)
      return createdTrip
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create trip'))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createTrip,
    isLoading,
    error,
  }
}
