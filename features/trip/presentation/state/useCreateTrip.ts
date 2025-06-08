import { useState } from 'react'
import { TripRepositoryImpl } from '../../data/repositories/TripRepositoryImpl'
import { CreateTripDTO, Trip } from '../../domain/models/Trip'
import { CreateManualTripUseCase } from '../../domain/usecases/CreateManualTrip'

export const useCreateTrip = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createTripUseCase = new CreateManualTripUseCase(
    new TripRepositoryImpl()
  )

  const createTrip = async (trip: CreateTripDTO): Promise<Trip | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const createdTrip = await createTripUseCase.execute(trip)
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
