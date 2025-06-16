import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'

import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import PressableOpacity from './PressableOpacity'

type StepperProps = {
  size?: 'small' | 'large'
  minValue?: number
  maxValue?: number
  value: number
  onValueChange: (newValue: number) => void
}

const NumStepper: React.FC<StepperProps> = ({
  size = 'small',
  value,
  minValue = -100,
  maxValue = 100,
  onValueChange,
}: StepperProps) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme, size), [theme])

  const minIsDisabled = useMemo(() => value <= minValue, [minValue, value])
  const maxIsDisabled = useMemo(() => value >= maxValue, [maxValue, value])

  const handleDecrement = () => {
    if (!minIsDisabled) {
      onValueChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (!maxIsDisabled) {
      onValueChange(value + 1)
    }
  }

  return (
    <View style={styles.wrapper}>
      <PressableOpacity
        style={[
          styles.button,
          minIsDisabled
            ? { backgroundColor: theme.disabled }
            : { backgroundColor: theme.primary },
        ]}
        disabled={minIsDisabled}
        onPress={handleDecrement}
      >
        <Ionicons
          name="remove-outline"
          size={size === 'small' ? 24 : 36}
          color={theme.white}
        />
      </PressableOpacity>

      <Text style={styles.value}>{value}</Text>

      <PressableOpacity
        style={[
          styles.button,
          maxIsDisabled
            ? { backgroundColor: theme.disabled }
            : { backgroundColor: theme.primary },
        ]}
        disabled={maxIsDisabled}
        onPress={handleIncrement}
      >
        <Ionicons
          name="add-outline"
          size={size === 'small' ? 24 : 36}
          color={theme.white}
        />
      </PressableOpacity>
    </View>
  )
}

export default NumStepper

const createStyles = (theme: typeof colorPalettes.light, size: string) =>
  StyleSheet.create({
    wrapper: {
      width: size === 'small' ? '40%' : '80%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      borderRadius: Radius.FULL,
      padding: 4,
    },
    value: {
      fontSize: size === 'small' ? FontSize.XXXL : 48,
      fontFamily: FontFamily.BOLD,
      marginTop: size === 'small' ? -5 : -10,
    },
  })
