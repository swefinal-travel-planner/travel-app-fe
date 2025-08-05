import { FontFamily } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useLabels } from '@/features/placeLabel/presentation/state/useLabels'
import React, { memo, useCallback, useState } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface LabelFilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (selectedLabels: string[]) => void
  initialSelectedLabels?: string[]
}

interface LabelButtonProps {
  label: string
  isSelected: boolean
  onPress: () => void
}

const LabelButton = memo<LabelButtonProps>(({ label, isSelected, onPress }) => (
  <TouchableOpacity style={[styles.labelButton, isSelected && styles.selectedLabel]} onPress={onPress}>
    <Text style={[styles.labelText, isSelected && styles.selectedLabelText]}>{label}</Text>
  </TouchableOpacity>
))

interface CategorySectionProps {
  category: string
  labels: string[]
  selectedLabels: string[]
  onLabelToggle: (label: string) => void
}

const CategorySection = memo<CategorySectionProps>(({ category, labels, selectedLabels, onLabelToggle }) => (
  <View style={styles.categoryContainer}>
    <Text style={styles.categoryTitle}>{category}</Text>
    <View style={styles.labelsList}>
      {labels.map((label) => (
        <LabelButton
          key={label}
          label={label}
          isSelected={selectedLabels.includes(label)}
          onPress={() => onLabelToggle(label)}
        />
      ))}
    </View>
  </View>
))

export const LabelFilterModal: React.FC<LabelFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialSelectedLabels = [],
}) => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>(initialSelectedLabels)
  const { data: labels, isLoading, error } = useLabels({ language: 'en' })

  const handleLabelToggle = useCallback((label: string) => {
    setSelectedLabels((prev) => {
      const isSelected = prev.includes(label)
      if (isSelected) {
        return prev.filter((l) => l !== label)
      }
      return [...prev, label]
    })
  }, [])

  const handleApply = useCallback(() => {
    onApply(selectedLabels)
    onClose()
  }, [selectedLabels, onApply, onClose])

  if (!visible) return null

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filter by labels</Text>
          <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {(() => {
          if (isLoading) {
            return (
              <View style={styles.centerContent}>
                <Text>Loading labels...</Text>
              </View>
            )
          }
          if (error) {
            return (
              <View style={styles.centerContent}>
                <Text style={styles.errorText}>Error loading labels</Text>
              </View>
            )
          }
          if (!labels) {
            return (
              <View style={styles.centerContent}>
                <Text>No labels available</Text>
              </View>
            )
          }
          return (
            <View style={styles.content}>
              {Object.entries(labels).map(([category, categoryLabels]) => (
                <CategorySection
                  key={category}
                  category={category}
                  labels={categoryLabels}
                  selectedLabels={selectedLabels}
                  onLabelToggle={handleLabelToggle}
                />
              ))}
            </View>
          )
        })()}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontFamily: FontFamily.REGULAR,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontFamily: FontFamily.BOLD,
    fontSize: 18,
    fontWeight: '600',
  },
  applyButton: {
    padding: 8,
  },
  applyButtonText: {
    fontFamily: FontFamily.BOLD,
    fontSize: 16,
    color: '#1A434E',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
    fontFamily: FontFamily.BOLD,
  },
  labelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.FULL,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLabel: {
    backgroundColor: '#1A434E',
  },
  labelText: {
    fontFamily: FontFamily.REGULAR,
    fontSize: 14,
    color: '#333',
  },
  selectedLabelText: {
    color: '#fff',
  },
  errorText: {
    fontFamily: FontFamily.REGULAR,
    color: '#D73C62',
    textAlign: 'center',
  },
})
