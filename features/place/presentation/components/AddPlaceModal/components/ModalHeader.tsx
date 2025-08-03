import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ModalHeaderProps } from '../types'

export const ModalHeader: React.FC<ModalHeaderProps> = ({ selectedTime, onFilterPress, theme }) => {
  const styles = createStyles(theme)

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.modalTitle}>Add places to {selectedTime}</Text>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="filter-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      marginBottom: 20,
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    modalTitle: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      textAlign: 'center',
      color: theme.primary,
    },
    filterButton: {
      position: 'absolute',
      right: 10,
      borderRadius: Radius.FULL,
    },
  })
