import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native'

interface TextFieldProps {
  placeholder: string
  label?: string
  rightIcon?: string
  leftIcon?: string
  error?: string
  required?: boolean
  type?: string
  value?: string
  onChange?: (text: string) => void
  onBlur?: () => void
}

export default function SearchTextField({
  placeholder,
  label,
  rightIcon,
  leftIcon,
  error,
  required,
  type,
  onChange,
  onBlur,
  value,
}: Readonly<TextFieldProps>) {
  return (
    <View style={styles.wrapper}>
      {leftIcon && (
        <Ionicons name={leftIcon as any} style={styles.leftIcon} size={24} />
      )}
      <TextInput
        numberOfLines={1}
        style={styles.input}
        placeholder={placeholder || ''}
        placeholderTextColor="#3F6453"
        onChangeText={(value) => {
          if (onChange) onChange(value)
        }}
        onBlur={() => {
          if (onBlur) onBlur()
        }}
        underlineColorAndroid="transparent"
        autoComplete={type ? (type as any) : 'none'}
      />
      {rightIcon && (
        <Ionicons name={rightIcon as any} style={styles.rightIcon} size={24} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF4E8',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#3F6453',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  leftIcon: {
    color: '#3F6453',
    marginLeft: 12,
  },
  rightIcon: {
    color: '#3F6453',
    marginRight: 12,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 0,
    borderRadius: 100,
    backgroundColor: '#FCF4E8',
    color: '#3F6453',
    fontFamily: 'NotoSerif_400Regular',
  },
  pinCodeContainer: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#3F6453',
  },
  pinCodeText: {
    fontFamily: 'NotoSerif_400Regular',
    fontSize: 36,
    color: '#3F6453',
  },
  focusedPinCodeContainer: {
    borderBottomWidth: 2,
    borderColor: '#3F6453',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
})
