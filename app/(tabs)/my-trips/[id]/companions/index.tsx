import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
export default function TripCompanionsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const tripId = params.tripId
  const [companions, setCompanions] = useState([
    {
      id: '1',
      name: 'Đặng Nhật Hòa',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  ])

  const handleAddCompanions = () => {
    //router.push(`/trips/${tripId}/add-companions`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          {companions.length > 0 ? (
            companions.map((companion) => (
              <View key={companion.id} style={styles.companionItem}>
                <Image
                  source={{ uri: companion.avatar }}
                  style={styles.image}
                />
                <Text style={{ fontSize: 18 }}>{companion.name}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCompanionText}>
              You're travelling solo.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Add Companions Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddCompanions}
        >
          <Text style={styles.addButtonText}>Add companions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
  },
  content: {
    flexGrow: 0,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#E5DACB',
    borderRadius: 8,
    padding: 16,
  },
  companionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  emptyCompanionText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#563D30',
  },
  buttonContainer: {
    margin: 16,
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: '#3F6453',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
})
