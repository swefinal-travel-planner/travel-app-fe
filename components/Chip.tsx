import { useMemo, useState } from 'react'
import { StyleSheet, Text } from 'react-native'

import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import PressableOpacity from './PressableOpacity'

interface ChipProps {
  value: string
  size: 'small' | 'large'
  onSelect?: (value: string) => void
  onDeselect?: (value: string) => void
}

const Chip: React.FC<ChipProps> = ({ value, size, onSelect, onDeselect }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme, size), [theme])

  const [selected, setSelected] = useState(false)

  return (
    <PressableOpacity
      style={[styles.wrapper, selected ? styles.selectedBg : styles.baseBg]}
      onPress={() => {
        const newSelected = !selected
        setSelected(newSelected)
        if (newSelected && onSelect) onSelect(value)
        if (!newSelected && onDeselect) onDeselect(value)
      }}
    >
      <Text
        style={[styles.value, selected ? styles.selectedText : styles.baseText]}
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
      margin: 4,
    },
    baseBg: {
      backgroundColor: theme.background,
    },
    selectedBg: { backgroundColor: theme.primary },
    value: {
      fontSize: size === 'large' ? FontSize.LG : FontSize.MD,
      fontFamily: FontFamily.REGULAR,
    },
    baseText: { color: theme.primary },
    selectedText: { color: theme.white },
  })
