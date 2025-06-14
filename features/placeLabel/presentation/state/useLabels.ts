import { useQuery } from '@tanstack/react-query'
import { PlaceLabelRepoImpl } from '../../data/placeLabelRepoImpl'
import { PlaceLabel } from '../../domain/models/PlaceLabel'
import { GetAllLabels } from '../../domain/usecases/GetAllLabels'

// Create singleton instances
const placeLabelRepo = new PlaceLabelRepoImpl()
const getAllLabels = new GetAllLabels(placeLabelRepo)

// Cache the labels data
let cachedLabels: PlaceLabel | null = null

export const useLabels = ({ language }: { language: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['place-labels', language],
    queryFn: async () => {
      // Return cached data if available
      if (cachedLabels) {
        return cachedLabels
      }
      // Otherwise fetch and cache
      const result = await getAllLabels.execute({ language })
      cachedLabels = result
      return result
    },
    staleTime: Infinity, // Data never goes stale
    gcTime: Infinity, // Never remove from cache
  })

  return {
    data,
    isLoading,
    error,
  }
}
