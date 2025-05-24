import { FontFamily } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import React, { useMemo, useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'

type DateRangeFieldProps = {
  startDate: string | null
  endDate: string | null
  setStartDate: (date: string | null) => void
  setEndDate: (date: string | null) => void
}

const DateRangeField = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangeFieldProps) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [modalVisible, setModalVisible] = useState(false)

  // Temp state for selection before confirmation
  const [tempStart, setTempStart] = useState<string | null>(null)
  const [tempEnd, setTempEnd] = useState<string | null>(null)

  const onDayPress = (date: DateData) => {
    const selectedDate = date

    // If no start date is selected or if both start and end dates are selected
    // reset the selection
    if (!tempStart || tempEnd) {
      setTempStart(selectedDate.dateString)
      setTempEnd(null)
      return
    }

    // Start date is already selected
    // If the selected date is after the start date, set it as the end date
    if (new Date(selectedDate.dateString) > new Date(tempStart)) {
      setTempEnd(selectedDate.dateString)
      return
    }

    // If the selected date is before the start date, set it as the new start date
    setTempStart(selectedDate.dateString)
    setTempEnd(null)
  }

  const getMarkedDates = () => {
    let marked: any = {}

    if (tempStart) {
      marked[tempStart] = {
        startingDay: true,
        color: '#70d7c7',
        textColor: 'white',
      }
    }

    if (tempStart && tempEnd) {
      let current = new Date(tempStart)
      const end = new Date(tempEnd)

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0]
        if (dateStr === tempStart || dateStr === tempEnd) {
          marked[dateStr] = {
            ...(dateStr === tempStart ? { startingDay: true } : {}),
            ...(dateStr === tempEnd ? { endingDay: true } : {}),
            color: '#70d7c7',
            textColor: 'white',
          }
        } else {
          marked[dateStr] = { color: '#c3f5e8', textColor: 'black' }
        }
        current.setDate(current.getDate() + 1)
      }
    }

    return marked
  }

  const handleConfirm = () => {
    setStartDate(tempStart)
    setEndDate(tempEnd)
    setModalVisible(false)
  }

  const openPicker = () => {
    setTempStart(startDate)
    setTempEnd(endDate)
    setModalVisible(true)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openPicker} style={styles.field}>
        <Text style={styles.fieldText}>
          {startDate && endDate
            ? `From: ${startDate} - To: ${endDate}`
            : 'Select date range'}
        </Text>
        <FontAwesome5 name="calendar-alt" size={24} color="black" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Calendar
              markingType={'period'}
              markedDates={getMarkedDates()}
              onDayPress={onDayPress}
            />

            <View style={styles.buttons}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.btn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                style={[styles.btn, { backgroundColor: '#70d7c7' }]}
                disabled={!tempStart || !tempEnd}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: { width: '100%' },
    field: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: Radius.FULL,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: '#f9f9f9',
    },
    icon: {
      fontSize: 18,
      marginRight: 8,
    },
    fieldText: {
      color: '#333',
      fontSize: 16,
      fontFamily: FontFamily.REGULAR,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: '#00000088',
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      overflow: 'hidden',
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 10,
    },
    btn: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 6,
      marginLeft: 10,
    },
    cancelText: {
      color: '#555',
    },
    confirmText: {
      color: 'white',
      fontWeight: 'bold',
    },
  })

export default DateRangeField
