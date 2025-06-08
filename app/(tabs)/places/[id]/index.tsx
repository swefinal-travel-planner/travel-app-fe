import LocationDetail from '@/components/LocationDetail'
import { useLocalSearchParams, useRouter } from 'expo-router'

const PlaceDetailScreen = () => {
  const { spotName, spotLocation, spotImage } = useLocalSearchParams()
  const router = useRouter()

  return (
    <LocationDetail
      title={spotName as string}
      introduction="Turtle Lake is a popular spot in HCMC..."
      activities={[
        { name: 'Catch turtle', iconName: 'paw-outline' },
        { name: 'Take photo', iconName: 'camera-outline' },
        { name: 'Eat snacks', iconName: 'fast-food-outline' },
      ]}
      onBack={() => router.back()}
    />
  )
}

export default PlaceDetailScreen
