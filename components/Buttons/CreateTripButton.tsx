import { Button } from 'react-native-ui-lib'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function CreateTripButton({
  color,
  onPress,
}: Readonly<{ color: string; onPress: () => void }>) {
  return (
    <Button
      round={true}
      style={{
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 20,
        right: 25,
        backgroundColor: color,
      }}
      onPress={onPress}
    >
      <Ionicons name="add" size={24} color="white" />
    </Button>
  )
}
