import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

const TripDetailViewScreen = ({ navigation }) => {
  // Dữ liệu mẫu cho chuyến đi
  const tripData = {
    destination: 'Ho Chi Minh City',
    dateRange: '11/11/2024 - 15/11/2024',
    totalCost: '7000 USD',
    exchangeRate: {
      from: '1 USD',
      to: '25,105 VND',
    },
    outlets: 'A, C',
    timezone: 'UTC+7',
    days: [
      {
        day: 1,
        date: '11/11/2024',
        spots: [
          {
            id: '1',
            name: 'Nhà thờ Đức Bà',
            address: 'Quận 1, Thành phố Hồ Chí Minh',
            timeSlot: '9:00 - 11:00',
            image: require('@/assets/images/alligator.jpg'),
          },
          {
            id: '2',
            name: 'Bến Nhà Rồng',
            address: 'Quận 4, Thành phố Hồ Chí Minh',
            timeSlot: '13:00 - 15:00',
            image: require('@/assets/images/alligator.jpg'),
          },
          {
            id: '3',
            name: 'Phố đi bộ Nguyễn Huệ',
            address: 'Quận 1, Thành phố Hồ Chí Minh',
            timeSlot: '18:00 - 20:00',
            image: require('@/assets/images/alligator.jpg'),
          },
          {
            id: '4',
            name: 'Phố đi bộ Nguyễn Huệ',
            address: 'Quận 1, Thành phố Hồ Chí Minh',
            timeSlot: '18:00 - 20:00',
            image: require('@/assets/images/alligator.jpg'),
          },
          {
            id: '5',
            name: 'Phố đi bộ Nguyễn Huệ',
            address: 'Quận 1, Thành phố Hồ Chí Minh',
            timeSlot: '18:00 - 20:00',
            image: require('@/assets/images/alligator.jpg'),
          },
        ],
      },
    ],
  }

  const [activeDay, setActiveDay] = useState(0)

  const handleEditTrip = () => {
    navigation.navigate('TripDetailEditScreen', { tripData })
  }

  const [activeTab, setActiveTab] = useState('Details')

  // Chuyển ngày
  const goToPreviousDay = () => {
    if (activeDay > 0) {
      setActiveDay(activeDay - 1)
    }
  }

  const goToNextDay = () => {
    if (activeDay < tripData.days.length - 1) {
      setActiveDay(activeDay + 1)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.content}>
        {/* Trip Info Card */}
        <View style={styles.tripCard}>
          <Text style={styles.destinationText}>{tripData.destination}</Text>
          <Text style={styles.dateAndCostText}>
            {tripData.dateRange} · {tripData.totalCost}
          </Text>

          <View style={styles.tripInfoRow}>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>
                {tripData.exchangeRate.from}
              </Text>
              <Text style={styles.tripInfoValue}>
                {tripData.exchangeRate.to}
              </Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Outlets</Text>
              <Text style={styles.tripInfoValue}>{tripData.outlets}</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Text style={styles.tripInfoLabel}>Timezone</Text>
              <Text style={styles.tripInfoValue}>{tripData.timezone}</Text>
            </View>
          </View>
        </View>

        {/* Day Navigation */}
        <View style={styles.dayNavigationContainer}>
          <TouchableOpacity
            onPress={goToPreviousDay}
            style={styles.dayNavigationButton}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>

          <Text style={styles.dayText}>
            Day {tripData.days[activeDay].day} ({tripData.days[activeDay].date})
          </Text>

          <TouchableOpacity
            onPress={goToNextDay}
            style={styles.dayNavigationButton}
          >
            <Ionicons name="chevron-forward" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.mapInstructionText}>
          Tap a spot to view it on the map
        </Text>

        {/* Spots List */}
        {tripData.days[activeDay].spots.map((spot) => (
          <View key={spot.id} style={styles.spotCard}>
            <View style={styles.spotImageContainer}>
              <Image
                source={require('@/assets/images/alligator.jpg')}
                style={styles.spotImage}
                defaultSource={require('@/assets/images/alligator.jpg')}
              />
            </View>
            <View style={styles.spotDetails}>
              <Text style={styles.spotName}>{spot.name}</Text>
              <View style={styles.spotLocationContainer}>
                <Ionicons name="location" size={14} color="#888" />
                <Text style={styles.spotAddress}>{spot.address}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditTrip}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E5DACB',
  },
  destinationText: {
    fontSize: 30,
    textAlign: 'center',
    color: '#563D30',
    marginBottom: 4,
  },
  dateAndCostText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  tripInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tripInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  tripInfoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  tripInfoValue: {
    fontSize: 14,
    color: '#333',
  },
  dayNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dayNavigationButton: {
    padding: 8,
  },
  dayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 16,
    color: '#563D30',
  },
  mapInstructionText: {
    fontSize: 14,
    color: '#563D30',
    textAlign: 'center',
    marginBottom: 16,
  },
  spotCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5DACB',
  },
  spotImageContainer: {
    width: 120,
    height: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotImage: {
    width: '100%',
    height: '100%',
    borderColor: '#D3B7A8',
    borderWidth: 2,
    borderRadius: 8,
  },
  spotDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  spotName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#563D30',
  },
  spotLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotAddress: {
    fontSize: 13,
    color: '#A68372',
    marginLeft: 4,
  },
  buttonContainer: {
    margin: 16,
    backgroundColor: 'transparent',
  },
  editButton: {
    backgroundColor: '#3F6453',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default TripDetailViewScreen
