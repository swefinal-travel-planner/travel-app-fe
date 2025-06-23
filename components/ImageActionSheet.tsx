import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export type ImageActionSheetOption = {
  label: string
  onPress: () => void
  cancel?: boolean
}

type ImageActionSheetProps = {
  visible: boolean
  onDismiss: () => void
  onImagePicked: (uri: string) => void
}

const ImageActionSheet = ({ visible, onDismiss, onImagePicked }: ImageActionSheetProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled && result.assets.length > 0) {
      onImagePicked(result.assets[0].uri)
    }
    onDismiss()
  }

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled && result.assets.length > 0) {
      onImagePicked(result.assets[0].uri)
    }
    onDismiss()
  }

  const options = [
    { label: 'Take Photo', onPress: takePhoto },
    { label: 'Choose from Library', onPress: pickImage },
    { label: 'Cancel', onPress: onDismiss, cancel: true },
  ]

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss} />
      <View style={styles.sheetContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, option.cancel && styles.cancelOption]}
            onPress={option.onPress}
          >
            <Text style={[styles.optionText, option.cancel && styles.cancelText]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    paddingTop: 8,
    paddingHorizontal: 16,
    elevation: 10,
  },
  option: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 18,
    color: '#222',
  },
  cancelText: {
    color: '#d00',
    fontWeight: 'bold',
  },
})

export default ImageActionSheet
