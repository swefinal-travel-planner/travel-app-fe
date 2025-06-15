import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import AntDesign from '@expo/vector-icons/AntDesign'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type TimeSlot = {
  label: string
  emoji: string
  timeRange: string
}

const PREV = 'prev'
const NEXT = 'next'

const TIME_SLOTS: TimeSlot[] = [
  { label: 'Morning', emoji: '🌅', timeRange: '6:00 AM - 12:00 PM' },
  { label: 'Midday', emoji: '🌞', timeRange: '10:00 AM - 2:00 PM' },
  { label: 'Afternoon', emoji: '🌤️', timeRange: '2:00 PM - 6:00 PM' },
  { label: 'Evening', emoji: '🌇', timeRange: '6:00 PM - Late' },
]

type TimeOfDayPickerProps = {
  theme: typeof colorPalettes.light
  selectedSlot: string
  onSelectSlot: (label: string) => void
}

export default function HorizontalTimeOfDayPicker({
  theme,
  selectedSlot,
  onSelectSlot,
}: Readonly<TimeOfDayPickerProps>) {
  const currentIndex = TIME_SLOTS.findIndex(
    (slot) => slot.label === selectedSlot
  )

  const handleChange = (direction: string) => {
    const newIndex = direction === PREV ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < TIME_SLOTS.length) {
      onSelectSlot(TIME_SLOTS[newIndex].label)
    }
  }

  const currentSlot = TIME_SLOTS[currentIndex]

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleChange(PREV)}
        disabled={currentIndex === 0}
        style={[styles.arrowButton, currentIndex === 0 && { opacity: 0.3 }]}
      >
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>

      <View style={[styles.slotItem]}>
        <Text style={[styles.slotTitle, { color: theme.primary }]}>
          {currentSlot.emoji} {currentSlot.label}
        </Text>
        <Text style={[styles.slotTime, { color: theme.primary }]}>
          {currentSlot.timeRange}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleChange(NEXT)}
        disabled={currentIndex === TIME_SLOTS.length - 1}
        style={[
          styles.arrowButton,
          currentIndex === TIME_SLOTS.length - 1 && { opacity: 0.3 },
        ]}
      >
        <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  slotItem: {
    flex: 1,
    padding: 16,
    borderRadius: Radius.FULL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotTitle: {
    fontFamily: FontFamily.BOLD,
    fontSize: FontSize.XL,
    marginBottom: 4,
  },
  slotTime: {
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.MD,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
