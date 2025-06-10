import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Chip from './Chip'

interface ListProps {
  data: { title: string; data: string[] }[]
  selectedValues?: string[]
  onValueChange?: (newValue: string[]) => void
}

const CollapsibleSectionList: React.FC<ListProps> = ({
  data,
  selectedValues = [],
  onValueChange,
}) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [expandedSections, setExpandedSections] = useState(new Set())

  // Store animation values for each section
  const animationValues = useRef<Map<string, Animated.Value>>(new Map()).current

  // Initialize animation values for sections
  useEffect(() => {
    data.forEach((section) => {
      if (!animationValues.has(section.title)) {
        const initialValue = expandedSections.has(section.title) ? 1 : 0
        animationValues.set(section.title, new Animated.Value(initialValue))
      }
    })
  }, [data])

  const getSelectedCountForSection = (title: string) => {
    const section = data.find((section) => section.title === title)
    if (!section) return 0

    return section.data.filter((item) => selectedValues.includes(item)).length
  }

  const handleToggle = (title: string) => {
    // Get or create animation value for this section
    let animValue = animationValues.get(title)
    if (!animValue) {
      animValue = new Animated.Value(0)
      animationValues.set(title, animValue)
    }

    // Update expanded sections state
    setExpandedSections((prevExpandedSections) => {
      const next = new Set(prevExpandedSections)
      const willExpand = !next.has(title)

      if (willExpand) {
        next.add(title)
      } else {
        next.delete(title)
      }

      // Animate to new state
      Animated.timing(animValue, {
        toValue: willExpand ? 1 : 0,
        duration: 300,
        useNativeDriver: false, // Height animations can't use native driver
      }).start()

      return next
    })
  }

  // Handle chip selection/deselection
  const handleSelect = (value: string) => {
    if (onValueChange) {
      const newValues = [...selectedValues, value]
      onValueChange(newValues)
    }
  }

  const handleDeselect = (value: string) => {
    if (onValueChange) {
      const newValues = selectedValues.filter((v) => v !== value)
      onValueChange(newValues)
    }
  }

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      sections={data}
      extraData={[expandedSections, selectedValues]}
      keyExtractor={(item, index) => item + index}
      renderItem={({ section: { title }, item, index }) => {
        const animValue = animationValues.get(title) || new Animated.Value(0)
        const isSelected = selectedValues.includes(item)

        return (
          <Animated.View
            style={{
              maxHeight: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100],
              }),
              opacity: animValue,
              overflow: 'hidden',
            }}
          >
            <Chip
              key={index}
              value={item}
              size="large"
              isSelected={isSelected}
              onSelect={handleSelect}
              onDeselect={handleDeselect}
              style={{ marginHorizontal: 16, marginBottom: 4 }}
            />
          </Animated.View>
        )
      }}
      renderSectionHeader={({ section: { title } }) => {
        const selectedCount = getSelectedCountForSection(title)

        return (
          <Pressable onPress={() => handleToggle(title)}>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>{title}</Text>
              {selectedCount > 0 && (
                <Text style={styles.selectedCount}>{selectedCount}</Text>
              )}
            </View>
          </Pressable>
        )
      }}
    />
  )
}

export default CollapsibleSectionList

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    scrollContent: {
      width: '100%',
      justifyContent: 'flex-start',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.secondary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: Radius.FULL,
      marginVertical: 6,
    },
    header: {
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.LG,
      flex: 1,
    },
    selectedCount: {
      backgroundColor: theme.primary,
      color: theme.white,
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.SM,
      width: 24,
      height: 24,
      borderRadius: 12,
      textAlign: 'center',
      lineHeight: 20,
      overflow: 'hidden',
    },
  })
