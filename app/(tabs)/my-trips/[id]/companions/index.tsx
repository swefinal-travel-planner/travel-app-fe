import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
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
      <StatusBar />
      <ScrollView style={styles.content}>
        {companions.length > 0 ? (
          companions.map((companion) => (
            <View
              key={companion.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Image
                source={{ uri: companion.avatar }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 16,
                }}
              />
              <Text style={{ fontSize: 18 }}>{companion.name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCompanionText}>You're travelling solo.</Text>
        )}
      </ScrollView>

      {/* Add Companions Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddCompanions}
        >
          <Text style={styles.addButtonText}>Edit</Text>
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
    flex: 1,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#E5DACB',
    borderRadius: 8,
    padding: 16,
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
