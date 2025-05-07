import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'

const TripDetailScreen = () => {
  // Dữ liệu mẫu cho các địa điểm trong trip
  const [tripItems, setTripItems] = useState([
    {
      id: '1',
      name: 'Bảo tàng Lịch sử',
      timeSlot: '9:00 - 11:00',
      address: '123 Đường Lịch sử, Hà Nội',
      image: 'https://example.com/museum.jpg',
    },
    {
      id: '2',
      name: 'Nhà hàng Hương Việt',
      timeSlot: '12:00 - 13:30',
      address: '45 Đường Ẩm thực, Hà Nội',
      image: 'https://example.com/restaurant.jpg',
    },
    {
      id: '3',
      name: 'Công viên Thống Nhất',
      timeSlot: '14:00 - 16:00',
      address: '78 Đường Công viên, Hà Nội',
      image: 'https://example.com/park.jpg',
    },
    {
      id: '4',
      name: 'Phố đi bộ Hồ Gươm',
      timeSlot: '17:00 - 19:00',
      address: 'Phố đi bộ, Hà Nội',
      image: 'https://example.com/walking-street.jpg',
    },
  ])

  // Hàm xử lý khi kết thúc việc kéo thả
  const handleDragEnd = ({ data }) => {
    setTripItems(data)
    // Ở đây bạn có thể gọi API để cập nhật thứ tự trên server
    console.log('Thứ tự mới đã được lưu:', data)
  }

  // Render mỗi địa điểm
  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.tripItemContainer,
            { backgroundColor: isActive ? '#f0f0f0' : 'white' },
          ]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="menu-outline" size={24} color="#666" />
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{item.timeSlot}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.placeImage}
              defaultSource={require('@/assets/images/alligator.jpg')} // Thay thế bằng ảnh placeholder của bạn
            />
            <View style={styles.textContainer}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeAddress} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chi tiết chuyến đi</Text>
          <Text style={styles.headerSubtitle}>Ngày 1 - Hà Nội</Text>
          <Text style={styles.dragInstructions}>
            Nhấn giữ và kéo để sắp xếp lại thứ tự
          </Text>
        </View>

        <DraggableFlatList
          data={tripItems}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  dragInstructions: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  tripItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  dragHandle: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  timeContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  timeText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  placeImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
})

export default TripDetailScreen
