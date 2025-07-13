import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TimeSlot } from '../../domain/models/Trip'

type SectionHeaderProps = {
  time: TimeSlot
  onAddItem: (time: TimeSlot) => void
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ time, onAddItem }) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{time.toUpperCase()}</Text>
      <TouchableOpacity onPress={() => onAddItem(time)} style={styles.addButton}>
        <FontAwesome6 name="plus" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
})
