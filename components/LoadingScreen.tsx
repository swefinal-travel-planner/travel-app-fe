import { colorPalettes } from '@/constants/Itheme'
import { FontFamily, FontSize } from '@/constants/font'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useMemo } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export type LoadingVariant = 'spinner' | 'dots' | 'pulse'

export type LoadingScreenProps = {
  /** Custom message to display below the spinner */
  message?: string
  /** Size of the loading spinner */
  size?: 'small' | 'large'
  /** Color of the spinner (defaults to theme primary) */
  spinnerColor?: string
  /** Whether to show the message */
  showMessage?: boolean
  /** Custom container style */
  containerStyle?: any
  /** Custom content style */
  contentStyle?: any
  /** Whether to use full screen layout */
  fullScreen?: boolean
  /** Loading animation variant */
  variant?: LoadingVariant
  /** Custom message style */
  messageStyle?: any
  /** Whether to show a subtle background overlay */
  showOverlay?: boolean
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  size = 'large',
  spinnerColor,
  showMessage = true,
  containerStyle,
  contentStyle,
  fullScreen = true,
  variant = 'spinner',
  messageStyle,
  showOverlay = false,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const spinnerColorValue = spinnerColor || theme.primary

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader color={spinnerColorValue} size={size} />
      case 'pulse':
        return <PulseLoader color={spinnerColorValue} size={size} />
      default:
        return <ActivityIndicator size={size} color={spinnerColorValue} />
    }
  }

  const containerStyles = [
    fullScreen ? styles.fullScreenContainer : styles.container,
    showOverlay && styles.overlay,
    containerStyle,
  ]

  return (
    <View style={containerStyles}>
      <View style={[styles.content, contentStyle]}>
        {renderLoadingIndicator()}
        {showMessage && <Text style={[styles.message, { color: theme.primary }, messageStyle]}>{message}</Text>}
      </View>
    </View>
  )
}

// Custom loading animations
const DotsLoader: React.FC<{ color: string; size: 'small' | 'large' }> = ({ color, size }) => {
  const dotSize = size === 'large' ? 8 : 6
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        dot: {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
        },
      }),
    [color, dotSize]
  )

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { opacity: 0.3 }]} />
      <View style={[styles.dot, { opacity: 0.6 }]} />
      <View style={[styles.dot, { opacity: 1 }]} />
    </View>
  )
}

const PulseLoader: React.FC<{ color: string; size: 'small' | 'large' }> = ({ color, size }) => {
  const pulseSize = size === 'large' ? 40 : 30
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: pulseSize,
          height: pulseSize,
          borderRadius: pulseSize / 2,
          backgroundColor: color,
          opacity: 0.7,
        },
      }),
    [color, pulseSize]
  )

  return <View style={styles.container} />
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    fullScreenContainer: {
      flex: 1,
      backgroundColor: theme.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },
    message: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      textAlign: 'center',
      marginTop: 8,
    },
  })

export default LoadingScreen
