import LocationDetail from '@/components/LocationDetail'
import { useLocalSearchParams, useRouter } from 'expo-router'

const PlaceDetailScreen = () => {
  const { name, address, images, properties, types, lat, lng, status, tripId, tripItemId } = useLocalSearchParams()
  console.log(images, 'img')
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
      status={status as 'not_started' | 'in_progress' | 'completed' | 'cancelled' | null}
      tripId={tripId as string | null}
      tripItemId={tripItemId as string | null}
      onBack={() => router.back()}
    />
  )
}

export default PlaceDetailScreen
