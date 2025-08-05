import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ModalFooterProps } from '../types'

export const ModalFooter: React.FC<ModalFooterProps> = ({ selectedCount, onCancel, onDone, theme }) => {
  const styles = createStyles(theme)
  const isDisabled = selectedCount === 0

  return (
    <View style={styles.bottomButtons}>
      <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}>
        <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modalButton, styles.doneButton, isDisabled && styles.disabledButton]}
        onPress={onDone}
        disabled={isDisabled}
      >
        <Text style={[styles.buttonText, styles.doneText]}>Done ({selectedCount})</Text>
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    bottomButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
    },
    modalButton: {
      flex: 1,
      padding: 15,
      borderRadius: Radius.FULL,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.background,
    },
    doneButton: {
      backgroundColor: theme.primary,
    },
    disabledButton: {
      backgroundColor: theme.disabled,
    },
    buttonText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
    },
    cancelText: {
      color: theme.primary,
    },
    doneText: {
      color: theme.white,
    },
  })
