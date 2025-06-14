import { Radius } from '@/constants/theme'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { LabelFilterModal } from './LabelFilterModal'

interface LabelFilterProps {
  onLabelSelect: (selectedLabels: string[]) => void
  selectedLabels: string[]
}

export const LabelFilter: React.FC<LabelFilterProps> = ({
  onLabelSelect,
  selectedLabels,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.title}>
          {selectedLabels.length > 0
            ? `${selectedLabels.length} labels selected`
            : 'Filter by Labels'}
        </Text>
      </TouchableOpacity>

      <LabelFilterModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onApply={onLabelSelect}
        initialSelectedLabels={selectedLabels}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: Radius.NORMAL,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
})
