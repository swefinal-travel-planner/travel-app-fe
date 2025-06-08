import { Place } from '@/features/place/domain/models/Place'
import { AddPlaceModal } from '@/features/place/presentation/components/AddPlaceComponent'
import {
  TimeSlot,
  timeSlots,
  TripItem,
} from '@/features/trip/domain/models/Trip'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SectionHeader } from './SectionHeader'
import { TripItemCard } from './TripItemCard'

export type SectionHeader = {
  type: 'header'
  time: TimeSlot
}

export type TypedTripItem = TripItem & {
  type: 'item'
  place?: Place
}

export type Item = TypedTripItem | SectionHeader

export interface SectionHeaderProps {
  time: TimeSlot
  onAddItem: (time: TimeSlot) => void
}

export interface TripItemCardProps {
  item: TypedTripItem
  drag: () => void
  isActive: boolean
}

export interface TripPlannerProps {
  onTripItemsChange?: (items: TypedTripItem[]) => void
}

function buildList(data: TypedTripItem[]): Item[] {
  const list: Item[] = []
  for (const time of timeSlots) {
    list.push({ type: 'header', time })
    const items = data.filter((item) => item.time_in_date === time)
    list.push(...items)
  }
  return list
}

export default function TripPlanner({
  onTripItemsChange,
}: Readonly<TripPlannerProps>) {
  const [data, setData] = useState(() => buildList([]))
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null)

  // Log every time the data changes
  React.useEffect(() => {
    console.log('Data changed:', data)
  }, [data])

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
    onTripItemsChange?.(updatedTripItems)
  }

  const handleAddItem = (time: TimeSlot) => {
    setSelectedTime(time)
    setModalVisible(true)
  }

  const handleConfirmAdd = (places: Place[]) => {
    if (!selectedTime) return

    const existingItems = data.filter(
      (item): item is TypedTripItem => item.type === 'item'
    )
    const orderNumbers = existingItems.map((item) => item.order_in_date ?? 0)
    const currentMaxOrder =
      orderNumbers.length > 0 ? Math.max(...orderNumbers) : 0

    const newItems: TypedTripItem[] = places.map((place, index) => ({
      name: place.en_name,
      type: 'item',
      item_id: place.id,
      time_in_date: selectedTime,
      order_in_date: currentMaxOrder + index + 1,
      place: place,
    }))

    const updatedItems = [...existingItems, ...newItems]
    setData(buildList(updatedItems))
    onTripItemsChange?.(updatedItems)
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
        <AddPlaceModal
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
