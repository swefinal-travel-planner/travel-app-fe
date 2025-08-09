import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { formatAttribute } from '@/utils/tripAttributes'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import Chip from './Chip'

interface ListProps {
  data: { title: string; data: string[] }[]
  selectedValues?: string[]
  onValueChange?: (newValue: string[]) => void
}

const CollapsibleSectionList: React.FC<ListProps> = ({ data, selectedValues = [], onValueChange }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

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

  // Sections that contain any of the selected values
  const selectedSections = useMemo(() => {
    if (!selectedValues || selectedValues.length === 0) return new Set<string>()
    const sectionsWithSelection = new Set<string>()
    data.forEach((section) => {
      const hasSelected = section.data.some((item) => selectedValues.includes(formatAttribute(item)))
      if (hasSelected) sectionsWithSelection.add(section.title)
    })
    return sectionsWithSelection
  }, [data, selectedValues])

  const getSelectedCountForSection = (title: string) => {
    const section = data.find((section) => section.title === title)
    if (!section) return 0

    return section.data.filter((item) => selectedValues.includes(formatAttribute(item))).length
  }

  const handleToggle = (title: string) => {
    // Ensure anim value exists for current
    let currentAnim = animationValues.get(title)
    if (!currentAnim) {
      currentAnim = new Animated.Value(0)
      animationValues.set(title, currentAnim)
    }

    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev.has(title)
      const next = new Set<string>()

      if (isCurrentlyOpen) {
        // Close current
        Animated.timing(currentAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start()
        return next
      }

      // Close all others
      animationValues.forEach((val, key) => {
        if (key !== title) {
          Animated.timing(val, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start()
        }
      })

      // Open only this one
      Animated.timing(currentAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start()
      next.add(title)
      return next
    })
  }

  // Handle chip selection/deselection
  const handleSelect = (value: string) => {
    if (onValueChange) {
      const newValues = [...selectedValues, formatAttribute(value)]
      onValueChange(newValues)
    }
  }

  const handleDeselect = (value: string) => {
    if (onValueChange) {
      const newValues = selectedValues.filter((v) => v !== formatAttribute(value))
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
        const isSelected = selectedValues.includes(formatAttribute(item))

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
              style={{ marginBottom: 8 }}
              align="left"
            />
          </Animated.View>
        )
      }}
      renderSectionHeader={({ section: { title } }) => {
        const selectedCount = getSelectedCountForSection(title)
        const hasAnySelection = selectedValues.length > 0
        const disabledBySelection = hasAnySelection && !selectedSections.has(title)
        const disabledByExpand = !hasAnySelection && expandedSections.size > 0 && !expandedSections.has(title)
        const isDisabled = disabledBySelection || disabledByExpand

        return (
          <Pressable onPress={() => handleToggle(title)} disabled={isDisabled}>
            <View style={[styles.headerContainer, isDisabled && { opacity: 0.5 }]}>
              <Text style={styles.header}>{title}</Text>
              {selectedCount > 0 && <Text style={styles.selectedCount}>{selectedCount}</Text>}
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
      flex: 1,
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
      lineHeight: 24,
      overflow: 'hidden',
    },
  })
