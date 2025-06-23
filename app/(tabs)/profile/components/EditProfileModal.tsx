import { colorPalettes } from '@/constants/Itheme'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { z } from 'zod'

const url = process.env.EXPO_PUBLIC_API_URL

interface EditProfileModalProps {
  theme: typeof colorPalettes.light
  visible: boolean
  closeModal: () => void
  field: string
  value: string
  onSave: (value: string, field: string) => void
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({ theme, visible, closeModal, field, value, onSave }) => {
  const [tempValue, setTempValue] = useState(value)
  const [error, setError] = useState('')
  const translateY = useSharedValue(0)

  useEffect(() => {
    setTempValue(value)
    setError('')
  }, [value, visible])

  // Schema validation với Zod
  const validateInput = (input: string) => {
    let schema
    if (field.includes('name')) {
      schema = z
        .string()
        .min(1, 'Name must be between 1 and 20 characters long')
        .max(20, 'Name must be between 2 and 20 characters long')
    } else if (field.includes('phone')) {
      schema = z.string().regex(/^\d{10}$/, 'Invalid phone number')
    } else {
      schema = z.string().email('Invalid email address')
    }

    const result = schema.safeParse(input)
    if (!result.success) {
      setError(result.error.errors[0].message)
    } else {
      setError('')
    }
  }

  // Gesture để vuốt xuống đóng modal
  const swipeDown = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = event.translationY > 0 ? event.translationY : 0
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        closeModal()
      } else {
        translateY.value = withSpring(0)
      }
    })

  // Animation style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      swipeDirection="down"
      onSwipeComplete={closeModal}
      backdropOpacity={0.5}
      style={styles.modalContainer}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoiding}>
        <GestureDetector gesture={swipeDown}>
          <Animated.View style={[styles.modalContent, animatedStyle]}>
            {/* Thanh vuốt xuống */}
            <View style={styles.dragHandle} />

            {/* Tiêu đề */}
            <Text style={styles.title}>
              {field.includes('name')
                ? 'Edit your name'
                : field.includes('phone')
                  ? 'Edit your phone number'
                  : 'Edit your email'}
            </Text>

            {/* Input */}
            <TextInput
              style={styles.input}
              placeholder={
                field.includes('name')
                  ? 'Enter your name'
                  : field.includes('phone')
                    ? 'Enter your phone number'
                    : 'Enter your email'
              }
              keyboardType={field.includes('phone') ? 'phone-pad' : 'default'}
              value={tempValue}
              onChangeText={(text: string) => {
                setTempValue(text)
                validateInput(text)
              }}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Nút Lưu */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: error ? 'gray' : theme.primary }]}
              onPress={() => onSave(tempValue, field)}
              disabled={!!error}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    height: '80%',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#3F6453',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  saveButton: {
    width: '100%',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default EditProfileModal

const mapFieldKey = (field: string) => {
  switch (field) {
    case 'Edit name':
      return 'name'
    case 'Edit phone number':
      return 'phoneNumber'
    case 'Edit email':
      return 'email'
    default:
      return field
  }
}
