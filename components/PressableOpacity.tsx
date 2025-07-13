import { useRef } from 'react'
import { Animated, Pressable } from 'react-native'

interface PressableOpacityProps {
  children: React.ReactNode
  [key: string]: any
  onPress?: () => void
}

const PressableOpacity = ({ children, onPress, style, ...props }: PressableOpacityProps) => {
  const animated = useRef(new Animated.Value(1)).current

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.1,
      duration: 50,
      useNativeDriver: true,
    }).start()
  }
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 70,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Pressable
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      onPress={onPress}
      style={{ width: '100%', justifyContent: 'center' }}
      {...props}
    >
      <Animated.View style={[style, { opacity: animated }]}>{children}</Animated.View>
    </Pressable>
  )
}

export default PressableOpacity
