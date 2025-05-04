import { useLocalSearchParams } from 'expo-router'
import { Text } from 'react-native'

export default function TripDetailScreen() {
  const { tripId } = useLocalSearchParams()

  return <Text>Chi tiết chuyến đi: {tripId}</Text>
}
