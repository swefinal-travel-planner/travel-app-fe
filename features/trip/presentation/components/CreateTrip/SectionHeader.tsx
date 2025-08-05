import { FontFamily, FontSize } from '@/constants/font'
import { TimeSlot } from '@/features/trip/domain/models/Trip'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type SectionHeaderProps = {
  time: TimeSlot
  onAddItem: (time: TimeSlot) => void
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ time, onAddItem }) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{time.charAt(0).toUpperCase() + time.slice(1).toLowerCase()}</Text>
      <TouchableOpacity onPress={() => onAddItem(time)} style={styles.addButton}>
        <Ionicons name="add" size={24} color="black" />
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
    fontFamily: FontFamily.BOLD,
    fontSize: FontSize.LG,
    marginBottom: 5,
    color: '#1A434E',
  },
  addButton: {
    padding: 4,
  },
})
