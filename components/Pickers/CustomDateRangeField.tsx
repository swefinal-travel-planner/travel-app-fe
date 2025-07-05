import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import React, { useMemo, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import Pressable from '../Pressable'

type CustomDateRangeFieldProps = {
  startDate: string | null
  endDate: string | null
  setStartDate: (date: string | null) => void
  setEndDate: (date: string | null) => void
  markingType?: 'dot' | 'custom' | 'period'
}

const CustomDateRangeField = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  markingType = 'dot',
}: CustomDateRangeFieldProps) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [modalVisible, setModalVisible] = useState(false)
  const [tempStart, setTempStart] = useState<string | null>(null)
  const [tempEnd, setTempEnd] = useState<string | null>(null)

  const onDayPress = (date: DateData) => {
    const selectedDate = date

    if (!tempStart || tempEnd) {
      setTempStart(selectedDate.dateString)
      setTempEnd(null)
      return
    }

    if (new Date(selectedDate.dateString) > new Date(tempStart)) {
      setTempEnd(selectedDate.dateString)
      return
    }

    setTempStart(selectedDate.dateString)
    setTempEnd(null)
  }

  // Dot marking for period selection
  const getDotMarkedDates = () => {
    let marked: any = {}

    if (tempStart) {
      marked[tempStart] = {
        marked: true,
        dotColor: theme.primary,
        selected: true,
        selectedColor: theme.primary,
        selectedTextColor: 'white',
      }
    }

    if (tempStart && tempEnd) {
      let current = new Date(tempStart)
      const end = new Date(tempEnd)

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0]
        if (dateStr === tempStart || dateStr === tempEnd) {
          marked[dateStr] = {
            marked: true,
            dotColor: theme.primary,
            selected: true,
            selectedColor: theme.primary,
            selectedTextColor: 'white',
          }
        } else {
          marked[dateStr] = {
            marked: true,
            dotColor: theme.primary,
            textColor: 'black',
          }
        }
        current.setDate(current.getDate() + 1)
      }
    }

    return marked
  }

  // Custom marking with period styling and dots
  const getCustomMarkedDates = () => {
    let marked: any = {}

    if (tempStart && tempEnd) {
      let current = new Date(tempStart)
      const end = new Date(tempEnd)

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0]
        const isStart = dateStr === tempStart
        const isEnd = dateStr === tempEnd

        marked[dateStr] = {
          marked: true,
          customStyles: {
            container: {
              backgroundColor: isStart || isEnd ? theme.primary : theme.secondary,
              borderRadius: isStart ? 20 : isEnd ? 20 : 0,
            },
            text: {
              color: isStart || isEnd ? 'white' : 'black',
              fontWeight: isStart || isEnd ? 'bold' : 'normal',
            },
          },
        }
        current.setDate(current.getDate() + 1)
      }
    }

    return marked
  }

  // Period marking with dots
  const getPeriodMarkedDates = () => {
    let marked: any = {}

    if (tempStart && tempEnd) {
      let current = new Date(tempStart)
      const end = new Date(tempEnd)

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0]
        const isStart = dateStr === tempStart
        const isEnd = dateStr === tempEnd

        marked[dateStr] = {
          periods: [
            {
              color: theme.primary,
              startingDay: isStart,
              endingDay: isEnd,
            },
          ],
          marked: true,
          dotColor: '#ffffff',
        }
        current.setDate(current.getDate() + 1)
      }
    }

    return marked
  }

  const getMarkedDates = () => {
    switch (markingType) {
      case 'dot':
        return getDotMarkedDates()
      case 'custom':
        return getCustomMarkedDates()
      case 'period':
        return getPeriodMarkedDates()
      default:
        return getDotMarkedDates()
    }
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
          {startDate && endDate ? `From: ${startDate} - To: ${endDate}` : 'Select date range'}
        </Text>
        <FontAwesome5 name="calendar-alt" size={24} color={theme.primary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Calendar markingType={markingType} markedDates={getMarkedDates()} onDayPress={onDayPress} />

            <View style={styles.buttons}>
              <Pressable
                onPress={handleConfirm}
                title="Confirm"
                style={{ color: theme.white, backgroundColor: theme.primary }}
                disabled={!tempStart || !tempEnd}
              />

              <Pressable
                onPress={() => setModalVisible(false)}
                title="Cancel"
                style={{ color: theme.text, backgroundColor: theme.secondary }}
              />
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
      borderRadius: Radius.FULL,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },
    icon: {
      fontSize: 18,
      marginRight: 8,
      color: theme.primary,
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
      overflow: 'hidden',
      borderRadius: 32,
      paddingHorizontal: 12,
      paddingVertical: 20,
    },
    buttons: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginVertical: 20,
      gap: 12,
    },
  })

export default CustomDateRangeField
