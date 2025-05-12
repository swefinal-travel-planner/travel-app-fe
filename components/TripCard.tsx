import { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import PressableOpacity from './PressableOpacity'

interface TripCardProps {
  tripId: string
  tripName: string
  tripImage: string
  days: number
  num_members: number
  budget: number
  isPinned: boolean
  onPress: () => void
}

const TripCard: React.FC<TripCardProps> = ({
  tripId,
  tripName,
  tripImage,
  days,
  num_members,
  budget,
  isPinned,
  onPress,
}) => {
  const [pinned, setPinned] = useState(isPinned)

  return (
    <PressableOpacity style={styles.wrapper} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: tripImage }} style={styles.image} />

        <PressableOpacity
          style={styles.overlay}
          onPress={() => setPinned(!pinned)}
        >
          <Ionicons
            name={pinned ? 'pin' : 'pin-outline'}
            size={20}
            color="white"
          />
        </PressableOpacity>
      </View>

      <View style={styles.spotInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {tripName}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.location} numberOfLines={1}>
            {days} days | {num_members} members | ${budget}
          </Text>
        </View>
      </View>
    </PressableOpacity>
  )
}

export default TripCard

const styles = StyleSheet.create({
  wrapper: {
    width: 360,
    height: 206,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A68372',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderColor: '#A68372',
  },
  overlay: {
    position: 'absolute',
    top: -112,
    right: 8,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotInfo: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    color: '#563D30',
    fontFamily: 'NotoSerif_400Regular',
    fontSize: 16,
    clip: 'ellipsis',
    marginTop: 2,
  },
  location: {
    color: '#A68372',
    fontFamily: 'NotoSerif_400Regular',
    fontSize: 12,
    clip: 'ellipsis',
    marginTop: 4,
  },
})
