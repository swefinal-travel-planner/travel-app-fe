import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo, useState } from 'react'
import { TextInput, View } from 'react-native'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import PressableOpacity from '../PressableOpacity'
import { createStyles } from './styles'

interface PasswordFieldProps {
  placeholder: string
  label?: string
  leftIcon?: string
  error?: string
  required?: boolean
  value?: string
  autoCapitalize?: 'none' | 'sentences'
  onChange?: (text: string) => void
  onBlur?: () => void
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  placeholder,
  label,
  leftIcon,
  error,
  required,
  onChange,
  value,
  autoCapitalize = 'sentences',
  onBlur,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [isVisible, setIsVisible] = useState(false)

  return (
    <View style={styles.wrapper}>
      {leftIcon && <Ionicons name={leftIcon as any} style={styles.leftIcon} size={24} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder ? placeholder : ''}
        underlineColorAndroid="transparent"
        textContentType="password"
        onChangeText={(value) => {
          if (onChange) onChange(value)
        }}
        onBlur={() => {
          if (onBlur) onBlur()
        }}
        secureTextEntry={!isVisible}
        autoCapitalize={autoCapitalize === 'none' ? 'none' : 'sentences'}
      />

      <PressableOpacity onPress={() => setIsVisible(!isVisible)}>
        <Ionicons name={isVisible ? 'eye-off-outline' : 'eye-outline'} style={styles.rightIcon} size={24} />
      </PressableOpacity>
    </View>
  )
}

export default PasswordField
