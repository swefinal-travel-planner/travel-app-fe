import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const times = ['morning', 'afternoon', 'evening', 'night'] as const
type Time = (typeof times)[number]

interface TripItem {
  type: 'item'
  item_id: string
  time_in_date: Time
}

interface SectionHeader {
  type: 'header'
  time: Time
}

type ListItem = TripItem | SectionHeader

const initialData: TripItem[] = [
  { type: 'item', item_id: '1', time_in_date: 'morning' },
  { type: 'item', item_id: '2', time_in_date: 'afternoon' },
  { type: 'item', item_id: '4', time_in_date: 'night' },
  { type: 'item', item_id: '5', time_in_date: 'evening' },
  { type: 'item', item_id: '6', time_in_date: 'evening' },
]

function buildList(data: TripItem[]): ListItem[] {
  const list: ListItem[] = []
  for (const time of times) {
    list.push({ type: 'header', time })
    const items = data.filter((item) => item.time_in_date === time)
    list.push(...items)
  }
  return list
}

export default function TripPlanner() {
  const [data, setData] = useState(() => buildList(initialData))

  const onDragEnd = ({ data: newData }: { data: ListItem[] }) => {
    const updatedData: TripItem[] = []
    let currentTime: Time | null = null

    for (const item of newData) {
      if (item.type === 'header') {
        currentTime = item.time
      } else if (item.type === 'item' && currentTime) {
        updatedData.push({
          ...item,
          time_in_date: currentTime,
        })
      }
    }

    setData(buildList(updatedData))
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
    if (item.type === 'header') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{item.time.toUpperCase()}</Text>
        </View>
      )
    }

    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.spotCard,
            { backgroundColor: isActive ? '#f0f0f0' : '#FFFFFF' },
          ]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="menu-outline" size={24} color="#666" />
          </View>

          <View style={styles.spotImageContainer}>
            <Image
              source={require('@/assets/images/alligator.jpg')}
              style={styles.spotImage}
            />
          </View>

          <View style={styles.spotDetails}>
            <Text style={styles.spotName}>{item.item_id}</Text>
            <View style={styles.spotLocationContainer}>
              <Ionicons name="location" size={14} color="#888" />
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <DraggableFlatList
        data={data}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${item.time}` : item.item_id
        }
        onDragEnd={onDragEnd}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    paddingVertical: 8,
    backgroundColor: '#f3f3f3',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  spotCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5DACB',
    alignItems: 'center',
  },
  dragHandle: {
    marginHorizontal: 8,
  },
  spotImageContainer: {
    width: 100,
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
})
