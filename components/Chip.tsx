import { useMemo, useState } from 'react'
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'

import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import PressableOpacity from './PressableOpacity'

interface ChipProps {
  value: string
  size: 'small' | 'large'
  isSelected?: boolean
  onSelect?: (value: string) => void
  onDeselect?: (value: string) => void
  style?: StyleProp<ViewStyle>
}

const Chip: React.FC<ChipProps> = ({
  value,
  size,
  isSelected = false,
  onSelect,
  onDeselect,
  style,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme, size), [theme])

  const [internalSelected, setInternalSelected] = useState(isSelected)

  // Use either controlled or uncontrolled selected state
  const selected = isSelected !== undefined ? isSelected : internalSelected

  return (
    <PressableOpacity
      style={[
        styles.wrapper,
        selected
          ? { backgroundColor: theme.primary }
          : { backgroundColor: theme.background },
        style,
      ]}
      onPress={() => {
        const newSelected = !selected
        // Only update internal state if not controlled externally
        if (isSelected === undefined) {
          setInternalSelected(newSelected)
        }
        if (newSelected && onSelect) onSelect(value)
        if (!newSelected && onDeselect) onDeselect(value)
      }}
    >
      <Text
        style={[
          styles.value,
          selected ? { color: theme.white } : { color: theme.primary },
        ]}
      >
        {value}
      </Text>
    </PressableOpacity>
  )
}

export default Chip

const createStyles = (theme: typeof colorPalettes.light, size: string) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Radius.FULL,
      paddingHorizontal: size === 'large' ? 16 : 12,
      paddingVertical: size === 'large' ? 8 : 4,
      marginRight: size === 'large' ? 12 : 8,
    },
    value: {
      fontSize: size === 'large' ? FontSize.LG : FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      textAlign: 'center',
    },
  })
