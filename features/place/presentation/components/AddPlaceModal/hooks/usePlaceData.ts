import { useCallback } from 'react'
import { usePlaces } from '../../../state/usePlaces'

export const usePlaceData = (shouldFetch: boolean, selectedLabels: string[]) => {
  const {
    data: places,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = usePlaces({
    limit: 20,
    location: 'Ho Chi Minh',
    language: 'en',
    enabled: shouldFetch,
    filter: selectedLabels.length > 0 ? selectedLabels.join(',') : undefined,
  })

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    places,
    isLoading,
    error,
    loadMore,
    isFetchingNextPage,
  }
}
