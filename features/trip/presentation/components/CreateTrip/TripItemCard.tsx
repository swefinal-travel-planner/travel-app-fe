import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TypedTripItem } from './Manual/DayPlanner'

export type TripItemCardProps = {
  item: TypedTripItem
  drag: () => void
  isActive: boolean
  onDelete?: (itemId: string) => void
}

export const TripItemCard: React.FC<TripItemCardProps> = ({ item, drag, isActive, onDelete }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const handleDelete = () => {
    if (onDelete && item.item_id) {
      onDelete(item.item_id)
    }
  }

  return (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={drag}
        disabled={isActive}
        style={[styles.spotCard, { backgroundColor: isActive ? '#f0f0f0' : theme.secondary }]}
      >
        <View style={styles.dragHandle}>
          <Ionicons name="menu-outline" size={24} color="#666" />
        </View>

        <View style={styles.spotImageContainer}>
          <Image
            source={{
              uri: item.place?.images[0],
            }}
            style={styles.spotImage}
          />
        </View>

        <View style={styles.spotDetails}>
          <Text style={styles.spotName}>{item.place?.name}</Text>
          <View style={styles.spotLocationContainer}>
            <Ionicons name="location-outline" size={14} color={theme.text} />
            <Text style={styles.spotDetails} numberOfLines={1}>
              {item.place?.address ?? 'No address available'}
            </Text>
          </View>
        </View>

        {onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </ScaleDecorator>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    spotCard: {
      flexDirection: 'row',
      borderRadius: 12,
      marginBottom: 12,
      paddingVertical: 8,
      overflow: 'hidden',
      backgroundColor: theme.secondary,
      alignItems: 'center',
    },
    dragHandle: {
      marginHorizontal: 8,
    },
    spotImageContainer: {
      width: 100,
      height: 80,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spotImage: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
      borderRadius: 8,
    },
    spotDetails: {
      flex: 1,
      justifyContent: 'center',
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.SM,
      color: theme.text,
      marginRight: 8,
    },
    spotName: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      marginBottom: 6,
      color: theme.primary,
    },
    spotLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deleteButton: {
      padding: 8,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
