import { useLocalSearchParams } from 'expo-router'

export const useTripId = (): number => {
  const { id } = useLocalSearchParams<{ id: string }>()
  return id ? parseInt(id, 10) : 0
}
