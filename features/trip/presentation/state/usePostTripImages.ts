import { useState } from 'react'
import { tripRepository } from '../../di/container'
import { PostTripImageUseCase } from '../../domain/usecases/PostTripImageUseCase'

export const usePostTripImages = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const postTripImageUseCase = new PostTripImageUseCase(tripRepository)

  const postTripImage = async (tripId: number, image: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await postTripImageUseCase.execute(tripId, image)
    } catch (err) {
      console.log('objectusePostTripImages.ts: postTripImage error:', err)
      setError(err instanceof Error ? err : new Error('Failed to upload images'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    postTripImage,
    isLoading,
    error,
  }
}
