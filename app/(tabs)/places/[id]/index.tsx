import LocationDetail from '@/components/LocationDetail'
import { useLocalSearchParams, useRouter } from 'expo-router'

const PlaceDetailScreen = () => {
  const { name, long, lat, image, properties, types } = useLocalSearchParams()
  const router = useRouter()

  return (
    <LocationDetail
      title={name as string}
      properties={properties as string}
      types={types as string}
      onBack={() => router.back()}
    />
  )
}

export default PlaceDetailScreen
