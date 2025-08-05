import { Place } from '@/features/place/domain/models/Place'
import { AddPlaceModal } from '@/features/place/presentation/components/AddPlaceComponent'
import { TimeSlot, timeSlots, TripItem } from '@/features/trip/domain/models/Trip'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useManualTripStore } from '../../../state/useManualTrip'
import { SectionHeader } from '../SectionHeader'
import { TripItemCard } from '../TripItemCard'

export type SectionHeader = {
  type: 'header'
  time: TimeSlot
}

export type TypedTripItem = TripItem & {
  type: 'item'
  place?: Place
}

type Item = SectionHeader | TypedTripItem

export type DayPlannerProps = {
  selectedDate: Date
}

function buildList(data: TypedTripItem[]): Item[] {
  const list: Item[] = []
  for (const time of timeSlots) {
    if (time === 'morning') {
      // skip the header for morning
      const items = data.filter((item) => item.timeInDate === time)
      list.push(...items)
    } else {
      list.push({ type: 'header', time })
      const items = data.filter((item) => item.timeInDate === time)
      list.push(...items)
    }
  }
  return list
}

export default function DayPlanner({ selectedDate }: Readonly<DayPlannerProps>) {
  const [data, setData] = useState<Item[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null)

  const { getItemsForDate, addTripItems, deleteTripItem, itemsByDate } = useManualTripStore()

  // Get the specific date key to avoid unnecessary re-renders
  const dateKey = selectedDate.toDateString()

  // Update data when the selected date changes or when items for this specific date change
  useEffect(() => {
    // Add defensive check to prevent issues during initial load
    if (!selectedDate) return

    try {
      const items = getItemsForDate(selectedDate)
      const typedItems = items.map((item) => ({
        ...item,
        type: 'item' as const,
      }))
      const listData = buildList(typedItems)
      setData(listData)
    } catch (error) {
      console.warn('Error updating DayPlanner data:', error)
      // Set empty data as fallback
      setData([])
    }
  }, [selectedDate, itemsByDate[dateKey]])

  const onDragEnd = useCallback(
    ({ data: newData }: { data: Item[] }) => {
      const updatedTripItems: TypedTripItem[] = []
      let currentTime: TimeSlot = 'morning'
      let globalOrder = 1

      for (const item of newData) {
        if (item.type === 'header') {
          currentTime = item.time
        } else if (item.type === 'item' && currentTime) {
          updatedTripItems.push({
            ...item,
            timeInDate: currentTime,
            orderInDay: globalOrder++,
          })
        }
      }

      // Only update the store, let useEffect handle the UI update
      addTripItems(updatedTripItems, selectedDate)
    },
    [addTripItems, selectedDate]
  )

  const handleAddItem = useCallback((time: TimeSlot) => {
    setSelectedTime(time)
    setModalVisible(true)
  }, [])

  const handleConfirmAdd = useCallback(
    (places: Place[]) => {
      if (!selectedTime) return

      // Get existing items directly from the store instead of local state
      const existingItems = getItemsForDate(selectedDate)
      const orderNumbers = existingItems.map((item) => item.orderInDay ?? 0)
      const currentMaxOrder = orderNumbers.length > 0 ? Math.max(...orderNumbers) : 0

      const newItems: TripItem[] = places.map((place, index) => ({
        name: place.name,
        title: place.name,
        item_id: place.id,
        timeInDate: selectedTime,
        orderInDay: currentMaxOrder + index + 1,
        placeID: place.id,
        place: place,
      }))

      const updatedItems = [...existingItems, ...newItems]
      // Only update the store, let useEffect handle the UI update
      addTripItems(updatedItems, selectedDate)
      setModalVisible(false)
      setSelectedTime(null)
    },
    [selectedTime, getItemsForDate, addTripItems, selectedDate]
  )

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      deleteTripItem(itemId, selectedDate)
      // The useEffect will automatically update the data when itemsByDate changes
      // No need to manually update local state here
    },
    [deleteTripItem, selectedDate]
  )

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      if (item.type === 'header') {
        return <SectionHeader time={item.time} onAddItem={handleAddItem} />
      }

      return <TripItemCard item={item} drag={drag} isActive={isActive} onDelete={handleDeleteItem} />
    },
    [handleAddItem, handleDeleteItem]
  )

  const keyExtractor = useCallback(
    (item: Item, index: number) => (item.type === 'header' ? `header-${item.time}` : item.item_id + String(index)),
    []
  )

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
        <SectionHeader time={'morning'} onAddItem={handleAddItem} />
        <DraggableFlatList
          data={data}
          keyExtractor={keyExtractor}
          onDragEnd={onDragEnd}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
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
    paddingHorizontal: 12,
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
  contentContainer: {
    paddingBottom: 40,
  },
})
