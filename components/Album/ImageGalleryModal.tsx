import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { TripImage } from '@/features/trip/domain/models/TripImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { Dimensions, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface ImageGalleryModalProps {
  visible: boolean
  images: TripImage[]
  selectedIndex: number | null
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function ImageGalleryModal({
  visible,
  images,
  selectedIndex,
  onClose,
  onNext,
  onPrevious,
}: Readonly<ImageGalleryModalProps>) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.white} />
            </TouchableOpacity>
            {selectedIndex !== null && (
              <Text style={styles.imageCounter}>
                {selectedIndex + 1} / {images.length}
              </Text>
            )}
          </View>

          {/* Image Container */}
          <View style={styles.modalImageContainer}>
            {selectedIndex !== null && images[selectedIndex] && (
              <Image source={{ uri: images[selectedIndex].imageUrl }} style={styles.modalImage} contentFit="contain" />
            )}
          </View>

          {/* Navigation Controls */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, selectedIndex === 0 && styles.navButtonDisabled]}
              onPress={onPrevious}
              disabled={selectedIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color={selectedIndex === 0 ? theme.disabled : theme.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, selectedIndex === images.length - 1 && styles.navButtonDisabled]}
              onPress={onNext}
              disabled={selectedIndex === images.length - 1}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={selectedIndex === images.length - 1 ? theme.disabled : theme.white}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    modalContainer: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    closeButton: {
      padding: 8,
    },
    imageCounter: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.white,
    },
    modalImageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalImage: {
      width: screenWidth,
      height: screenHeight * 0.7,
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 20,
    },
    navButton: {
      padding: 12,
      borderRadius: Radius.FULL,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    navButtonDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  })
