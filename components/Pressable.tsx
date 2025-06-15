import React, { useMemo } from 'react'
import { StyleSheet, Text } from 'react-native'

import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import PressableOpacity from './PressableOpacity'

interface PressableProps {
  title: string
  onPress?: () => void
  disabled?: boolean
  style?: ButtonStyleProps
}

interface ButtonStyleProps {
  backgroundColor: string
  color: string
  [key: string]: any
}

// custom button component
const Pressable: React.FC<PressableProps> = ({
  title,
  onPress,
  disabled,
  style,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <PressableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.wrapper, disabled ? styles.disabled : style]}
    >
      <Text style={[styles.title, style && { color: style.color }]}>
        {title}
      </Text>
    </PressableOpacity>
  )
}

export default Pressable

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    disabled: {
      backgroundColor: theme.disabled,
    },
    title: {
      fontSize: 14,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
  })
