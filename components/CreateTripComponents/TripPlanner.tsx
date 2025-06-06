import { usePlaces } from '@/hooks/usePlaces'
import { TimeSlot, timeSlots, TripItem } from '@/types/Trip/Trip'
import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AddItemModal } from './TripPlanner/AddItemModal'
import { SectionHeader } from './TripPlanner/SectionHeader'
import { TripItemCard } from './TripPlanner/TripItemCard'

export type SectionHeader = {
  type: 'header'
  time: TimeSlot
}

export type TypedTripItem = TripItem & { type: 'item' }

export type Item = TypedTripItem | SectionHeader

export interface AddItemModalProps {
  visible: boolean
  selectedTime: TimeSlot | null
  onClose: () => void
  onConfirm: () => void
}

export interface SectionHeaderProps {
  time: TimeSlot
  onAddItem: (time: TimeSlot) => void
}

export interface TripItemCardProps {
  item: TypedTripItem
  drag: () => void
  isActive: boolean
}

const initialData: TypedTripItem[] = [
  {
    type: 'item',
    order_in_date: 1,
    item_id: '1',
    name: 'ITEM 1',
    time_in_date: 'morning',
  },
  {
    type: 'item',
    order_in_date: 2,
    item_id: '2',
    name: 'ITEM 2',
    time_in_date: 'afternoon',
  },
  {
    type: 'item',
    order_in_date: 3,
    item_id: '4',
    name: 'ITEM 3',
    time_in_date: 'evening',
  },
  {
    type: 'item',
    order_in_date: 4,
    item_id: '5',
    name: 'ITEM 4',
    time_in_date: 'evening',
  },
  {
    type: 'item',
    order_in_date: 5,
    item_id: '6',
    name: 'ITEM 5',
    time_in_date: 'evening',
  },
]

function buildList(data: TypedTripItem[]): Item[] {
  const list: Item[] = []
  for (const time of timeSlots) {
    list.push({ type: 'header', time })
    const items = data.filter((item) => item.time_in_date === time)
    list.push(...items)
  }
  return list
}

export default function TripPlanner() {
  const [data, setData] = useState(() => buildList(initialData))
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null)

  const {
    data: places,
    isLoading,
    error,
  } = usePlaces({
    limit: 10, // Adjust limit as needed
    location: 'Ho Chi Minh',
    language: 'en',
  })

  // Log places when they change
  React.useEffect(() => {
    if (places) {
      console.log('Places loaded:', places)
    }
  }, [places])

  // Log every time the data changes
  React.useEffect(() => {
    console.log('Data changed:', data)
  }, [data])

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Error loading places: {error.message}</Text>
      </View>
    )
  }

  const onDragEnd = ({ data: newData }: { data: Item[] }) => {
    const updatedTripItems: TypedTripItem[] = []
    let currentTime: TimeSlot | null = null
    let globalOrder = 1

    for (const item of newData) {
      if (item.type === 'header') {
        currentTime = item.time
      } else if (item.type === 'item' && currentTime) {
        updatedTripItems.push({
          ...item,
          time_in_date: currentTime,
          order_in_date: globalOrder++,
        })
      }
    }

    setData(buildList(updatedTripItems))
  }

  const handleAddItem = (time: TimeSlot) => {
    setSelectedTime(time)
    setModalVisible(true)
  }

  const handleConfirmAdd = () => {
    if (!selectedTime) return

    const newItem: TypedTripItem = {
      name: `New TypedTripItem ${Date.now().toString()}`,
      type: 'item',
      item_id: Date.now().toString(),
      time_in_date: selectedTime,
      order_in_date:
        data.filter((item): item is TypedTripItem => item.type === 'item')
          .length + 1,
    }

    const updatedItems = [
      ...data.filter((item): item is TypedTripItem => item.type === 'item'),
      newItem,
    ]

    setData(buildList(updatedItems))
    setModalVisible(false)
    setSelectedTime(null)
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    if (item.type === 'header') {
      return <SectionHeader time={item.time} onAddItem={handleAddItem} />
    }

    return <TripItemCard item={item} drag={drag} isActive={isActive} />
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <AddItemModal
          visible={modalVisible}
          selectedTime={selectedTime}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirmAdd}
        />
      </View>
      <GestureHandlerRootView style={styles.container}>
        <DraggableFlatList
          data={data}
          keyExtractor={(item) =>
            item.type === 'header' ? `header-${item.time}` : item.item_id
          }
          onDragEnd={onDragEnd}
          renderItem={renderItem}
        />
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
