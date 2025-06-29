import LocationDetail from '@/components/LocationDetail'
import { useLocalSearchParams, useRouter } from 'expo-router'

const PlaceDetailScreen = () => {
  const { name, address, images, properties, types, lat, lng } = useLocalSearchParams()
  const router = useRouter()

  return (
    <LocationDetail
      title={name as string}
      properties={properties as string}
      lat={lat as string}
      lng={lng as string}
      types={types as string}
      images={images ? JSON.parse(images as string) : []}
      address={address as string}
      onBack={() => router.back()}
    />
  )
}

export default PlaceDetailScreen
