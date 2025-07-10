import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { getPlaceHolder } from '@/features/trip/utils/AdaptiveImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { TripItem } from '@/lib/types/Trip'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

type TripModification = {
  orderInDay: number
  placeID: string
  timeInDate: string
  tripDay: number
}

// Type for list items including dividers
type ListItem =
  | TripItem
  | { type: 'time-divider'; id: string; time: 'Morning' | 'Afternoon' | 'Evening' | 'Night' }
  | { type: 'combined-divider'; id: string; date: string; time: 'Morning' | 'Afternoon' | 'Evening' | 'Night' } // combine the day divider and the first time divider

const TripDetailModifyScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const { tripData } = useLocalSearchParams()
  const [tripItems, setTripItems] = useState<TripModification[]>()
  const [currentListData, setCurrentListData] = useState<ListItem[]>([])
  const [firstDivider, setFirstDivider] = useState<{
    date: string
    time: 'Morning' | 'Afternoon' | 'Evening' | 'Night'
  }>({
    date: '',
    time: 'Morning',
  })

  const data = useMemo(() => {
    const parsedData = JSON.parse(tripData as string) || []
    // Flatten nested spots arrays
    return parsedData.map((day: any) => ({
      ...day,
      spots: day.spots.flat(),
    }))
  }, [tripData])

  // Create list with dividers based on sections - only run initially
  const initialListData = useMemo(() => {
    const result: ListItem[] = []
    const timeSlots = ['morning', 'afternoon', 'evening', 'night'] as const
    let isFirstDayFirstTimeSlot = true

    data.forEach((day: { date: string; day: number; spots: TripItem[] }, dayIndex: number) => {
      // Add day divider
      const dayDate = day.date || `Day ${day.day}`
      let isFirstTimeSlot = true

      // Group spots by time slot
      timeSlots.forEach((timeSlot) => {
        const spotsForTimeSlot = day.spots.filter((spot: any) => spot.timeSlot === timeSlot)

        if (spotsForTimeSlot.length > 0) {
          if (isFirstTimeSlot) {
            if (isFirstDayFirstTimeSlot) {
              // For the very first day and time slot, set the firstDivider state instead of pushing to list
              setFirstDivider({
                date: dayDate,
                time: (timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)) as
                  | 'Morning'
                  | 'Afternoon'
                  | 'Evening'
                  | 'Night',
              })
              isFirstDayFirstTimeSlot = false
            } else {
              // For other first time slots of other days, create a combined divider
              result.push({
                type: 'combined-divider',
                id: `combined-divider-${dayIndex}-${timeSlot}`,
                date: dayDate,
                time: (timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)) as
                  | 'Morning'
                  | 'Afternoon'
                  | 'Evening'
                  | 'Night',
              })
            }
            isFirstTimeSlot = false
          } else {
            // For subsequent time slots, just add time divider
            result.push({
              type: 'time-divider',
              id: `time-divider-${dayIndex}-${timeSlot}`,
              time: (timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)) as
                | 'Morning'
                | 'Afternoon'
                | 'Evening'
                | 'Night',
            })
          }

          // Add spots for this time slot
          spotsForTimeSlot.forEach((spot: TripItem) => {
            result.push(spot)
          })
        }
      })
    })

    return result
  }, [data])

  // Initialize currentListData when initialListData changes
  useEffect(() => {
    setCurrentListData(initialListData)
  }, [initialListData])

  const handleDragEnd = ({ data: newData }: { data: ListItem[] }) => {
    // Immediately update the current list data
    setCurrentListData(newData)

    // Extract only trip items and update their timeSlot based on position
    const tripItemsOnly = newData.filter(
      (item): item is TripItem =>
        !('type' in item) || (item.type !== 'time-divider' && item.type !== 'combined-divider')
    ) as TripItem[]

    // Update timeSlot based on the nearest time divider above each item
    const updatedTripItems = tripItemsOnly.map((item) => {
      const itemIndex = newData.findIndex((dataItem) => !('type' in dataItem) && dataItem.id === item.id)

      // Find the nearest time divider above this item
      let timeSlot = 'morning' // default
      for (let i = itemIndex - 1; i >= 0; i--) {
        const checkItem = newData[i]
        if ('type' in checkItem && (checkItem.type === 'time-divider' || checkItem.type === 'combined-divider')) {
          timeSlot = checkItem.time.toLowerCase()
          break
        }
      }

      return {
        ...item,
        timeSlot,
      }
    })

    setTripItems(updatedTripItems)
    console.log('Updated trip items:', updatedTripItems)
  }

  const handleDeleteItem = (itemToDelete: TripItem) => {
    Alert.alert('Delete Spot', 'Are you sure you want to delete this spot?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Remove item from current list data
          const newListData = currentListData.filter((item) => 'type' in item || item.id !== itemToDelete.id)
          setCurrentListData(newListData)

          // Update trip items
          const updatedTripItems = newListData.filter(
            (item): item is TripItem =>
              !('type' in item) || (item.type !== 'time-divider' && item.type !== 'combined-divider')
          ) as TripItem[]
          setTripItems(updatedTripItems)
        },
      },
    ])
  }

  const handleGoBack = () => {
    router.back()
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
    // Render combined divider (day + first time slot)
    if ('type' in item && item.type === 'combined-divider') {
      return (
        <View>
          <View style={styles.dayDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dayDividerText}>{item.date}</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.timeDivider}>
            <Text style={styles.timeDividerText}>{item.time}</Text>
          </View>
        </View>
      )
    }

    // Render time divider
    if ('type' in item && item.type === 'time-divider') {
      return (
        <View style={styles.timeDivider}>
          <Text style={styles.timeDividerText}>{item.time}</Text>
        </View>
      )
    }

    // Render trip item
    const tripItem = item as any // Use any since the structure doesn't match TripItem exactly

    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[styles.spotCard, { backgroundColor: isActive ? '#f0f0f0' : theme.secondary }]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="menu-outline" size={24} color={theme.text} />
          </View>

          <View style={styles.spotImageContainer}>
            <Image source={tripItem.image || getPlaceHolder(50, 50)} style={styles.spotImage} />
          </View>
          <View style={styles.spotDetails}>
            <Text style={styles.spotName}>{tripItem.name}</Text>
            <View style={styles.spotLocationContainer}>
              <Ionicons name="location-outline" size={14} color={theme.text} />
              <Text style={styles.spotAddress} numberOfLines={1}>
                {tripItem.address}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(tripItem)}>
            <Ionicons name="trash-outline" size={24} color={theme.error} />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header and Back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modify trip</Text>
      </View>

      {/* Draggable list item */}
      <DraggableFlatList
        data={currentListData}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => ('type' in item ? item.id : item.id.toString())}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.dayDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dayDividerText}>{firstDivider.date}</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.timeDivider}>
              <Text style={styles.timeDividerText}>{firstDivider.time}</Text>
            </View>
          </View>
        }
      />
    </GestureHandlerRootView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
      paddingTop: 40,
    },
    header: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 22,
      paddingVertical: 16,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: FontSize.XXL,
      textAlign: 'center',
      flex: 1,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 80,
    },
    spotCard: {
      flexDirection: 'row',
      marginBottom: 12,
      overflow: 'hidden',
      alignItems: 'center',
      backgroundColor: theme.secondary,
      borderRadius: Radius.ROUNDED,
    },
    dragHandle: {
      paddingVertical: 8,
      paddingLeft: 12,
    },
    spotImageContainer: {
      width: 90,
      height: 80,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spotImage: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.NORMAL,
    },
    spotDetails: {
      flex: 1,
      padding: 12,
      justifyContent: 'center',
    },
    spotName: {
      fontSize: FontSize.LG,
      fontWeight: '500',
      marginBottom: 6,
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
    },
    spotLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spotAddress: {
      fontSize: FontSize.SM,
      color: theme.text,
      marginLeft: 4,
      fontFamily: FontFamily.REGULAR,
    },
    deleteButton: {
      paddingVertical: 8,
      paddingRight: 12,
      paddingLeft: 4,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.dimText || '#E0E0E0',
      opacity: 0.3,
    },
    dayDivider: {
      marginVertical: 20,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dayDividerText: {
      fontSize: FontSize.MD,
      color: theme.primary,
      marginHorizontal: 12,
      fontFamily: FontFamily.BOLD,
      backgroundColor: theme.white,
      paddingHorizontal: 8,
    },
    timeDivider: {
      marginVertical: 12,
      paddingHorizontal: 24,
    },
    timeDividerText: {
      fontSize: FontSize.LG,
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      textAlign: 'left',
    },
  })

export default TripDetailModifyScreen
