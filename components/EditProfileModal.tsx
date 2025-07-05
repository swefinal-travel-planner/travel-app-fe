import CustomTextField from '@/components/input/CustomTextField'
import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useEffect, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { z } from 'zod'

interface EditProfileModalProps {
  visible: boolean
  closeModal: () => void
  field: string
  value: string
  onSave: (value: string, field: string) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, closeModal, field, value, onSave }) => {
  const [tempValue, setTempValue] = useState(value === 'No phone number set' ? '' : value)
  const [error, setError] = useState('')
  const translateY = useSharedValue(0)

  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

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
            <CustomTextField
              placeholder={
                field.includes('name')
                  ? 'Enter your name'
                  : field.includes('phone')
                    ? 'Enter your phone number'
                    : 'Enter your email'
              }
              keyboardType={field.includes('phone') ? 'phone-pad' : 'default'}
              value={tempValue}
              onChange={(text: string) => {
                setTempValue(text)
                validateInput(text)
              }}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              title="Save"
              style={{ backgroundColor: theme.primary, color: theme.white, marginTop: 20 }}
              onPress={() => onSave(tempValue, field)}
            />
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    modalContainer: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    keyboardAvoiding: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.white,
      padding: 20,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      alignItems: 'center',
      height: '80%',
      fontFamily: FontFamily.REGULAR,
    },
    dragHandle: {
      width: 40,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 10,
      marginBottom: 10,
    },
    title: {
      fontSize: FontSize.XXL,
      marginBottom: 20,
      fontFamily: FontFamily.BOLD,
      textAlign: 'center',
    },
    error: {
      color: theme.error,
      marginTop: 20,
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
    },
    saveButton: {
      width: '100%',
      padding: 15,
      borderRadius: Radius.FULL,
      alignItems: 'center',
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
