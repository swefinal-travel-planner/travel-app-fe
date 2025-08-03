import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { PlaceItemProps } from '../types'

export const PlaceItem: React.FC<PlaceItemProps> = ({ place, isSelected, onToggle, theme }) => {
  const styles = createStyles(theme)

  return (
    <View style={[styles.placeContainer, isSelected && styles.selectedContainer]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: place.images[0] }} style={styles.placeImage} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{place.name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={theme.dimText} style={styles.locationIcon} />
            <Text style={styles.placeType}>{place.address}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isSelected && styles.selectedButton]}
          onPress={() => onToggle(place)}
        >
          <Text style={styles.addButtonText}>{isSelected ? 'Selected' : 'Select'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    placeContainer: {
      flexDirection: 'column',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.background,
      backgroundColor: theme.background,
      borderRadius: Radius.NORMAL,
      gap: 12,
    },
    imageContainer: {
      width: '100%',
      alignItems: 'center',
    },
    placeImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    placeInfo: {
      flex: 1,
    },
    placeName: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationIcon: {
      marginRight: 4,
    },
    placeType: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.dimText,
      marginTop: 4,
    },
    addButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: Radius.FULL,
    },
    addButtonText: {
      color: theme.white,
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
    },
    selectedContainer: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    selectedButton: {
      backgroundColor: theme.disabled,
    },
  })
