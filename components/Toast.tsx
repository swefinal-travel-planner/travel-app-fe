import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export interface ToastProps {
  type: 'error' | 'info' | 'warning' | 'success' | 'default'
  message: string
  onClose?: () => void
  position?: 'top' | 'center' | 'bottom'
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose, position = 'bottom', duration = 3000 }) => {
  let iconName = ''
  let iconColor = '#000'
  let borderColor = '#ccc'

  switch (type) {
    case 'error':
      iconName = 'close-circle'
      iconColor = '#ef4444'
      borderColor = '#ef4444'
      break
    case 'info':
      iconName = 'alert-circle'
      iconColor = '#3b82f6'
      borderColor = '#3b82f6'
      break
    case 'warning':
      iconName = 'warning'
      iconColor = '#f59e0b'
      borderColor = '#f59e0b'
      break
    case 'success':
      iconName = 'checkmark-circle'
      iconColor = '#22c55e'
      borderColor = '#22c55e'
      break
    default:
      iconName = 'notifications'
      iconColor = '#888'
      borderColor = '#888'
  }

  const title = type.charAt(0).toUpperCase() + type.slice(1)

  // Animation
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose?.())
    }, duration)

    return () => clearTimeout(timeout)
  }, [])

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: 50 }
      case 'center':
        return { top: Dimensions.get('window').height / 2 - 40 }
      case 'bottom':
      default:
        return { bottom: 50 }
    }
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        getPositionStyle(),
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        <View style={[styles.leftBorder, { backgroundColor: borderColor }]} />
        <View style={styles.content}>
          <Ionicons name={iconName} size={24} color={iconColor} style={styles.icon} />
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: 'hidden',
  },
  leftBorder: {
    width: 8,
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    marginLeft: 10,
    padding: 16,
    alignSelf: 'flex-start',
  },
})

export default Toast
