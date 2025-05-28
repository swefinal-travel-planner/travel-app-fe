import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useManualTripStore } from '@/store/manualTripStore'
import { Trip, TripItem } from '@/types/Trip/Trip'

const categories = ['Garden', 'Shop', 'Museum', 'Park'] as const
type Category = (typeof categories)[number]

const allItems: TripItem[] = [
  {
    id: '1',
    name: 'Botanical Garden',
    category: 'Garden',
    location: 'District 1',
  },
  { id: '2', name: 'Vincom Mall', category: 'Shop', location: 'District 3' },
  {
    id: '3',
    name: 'War Remnants Museum',
    category: 'Museum',
    location: 'District 1',
  },
  { id: '4', name: 'Central Park', category: 'Park', location: 'District 2' },
  // add more
]

// <AddItemComponent
//   onClose={() => setAddModalVisible(false)}
//   onAddItem={setTripItems}
// />

type AddItemProps = {
  currentTrip: Trip
  onClose: () => void
  onAddItem: (item: TripItem[]) => void
}

export default function AddItemComponent({
  currentTrip,
  onClose,
  onAddItem,
}: Readonly<AddItemProps>) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Garden')

  const manualTrip = useManualTripStore((state) => state.trip)
  const setManualTrip = useManualTripStore((state) => state.setManualTrip)

  const filteredItems = useMemo(
    () => allItems.filter((item) => item.category === selectedCategory),
    [selectedCategory]
  )

  //   const handleAddItem = (item: TripItem) => {
  //     if (manualTrip.items?.some((i) => i.id === item.id)) return
  //     setManualTrip((prev) => ({
  //       items: [...(prev.items ?? []), item],
  //     }))
  //   }

  const renderItem = ({ item }: { item: TripItem }) => {
    const isAdded = manualTrip.items?.some((i) => i.id === item.id)

    return (
      <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text>{item.name}</Text>
        <Text style={{ fontSize: 12, color: 'gray' }}>{item.location}</Text>
        <TouchableOpacity
          //   onPress={() => handleAddItem(item)}
          disabled={isAdded}
          style={{
            marginTop: 5,
            padding: 5,
            backgroundColor: isAdded ? '#aaa' : '#007BFF',
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white' }}>{isAdded ? 'Added' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={{
              padding: 10,
              backgroundColor: selectedCategory === cat ? '#007BFF' : '#E0E0E0',
              marginRight: 5,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: selectedCategory === cat ? '#fff' : '#000' }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Item List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: '#fff',
  },
  categoryTab: {
    padding: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
})
