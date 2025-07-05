import { getPlaceHolder } from '@/components/AdaptiveImage'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { TripImage } from '@/features/trip/domain/models/TripImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

interface AlbumGridProps {
  images: TripImage[]
  onImagePress: (index: number) => void
  onAddPhotoPress: () => void
  isUploading: boolean
}

export default function AlbumGrid({ images, onImagePress, onAddPhotoPress, isUploading }: Readonly<AlbumGridProps>) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.albumGrid}>
        {/* Album items */}
        {images.map((item, index) => (
          <View key={item.id} style={styles.albumItem}>
            <TouchableOpacity style={styles.imageContainer} onPress={() => onImagePress(index)}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Image source={{ uri: getPlaceHolder(50, 50) }} style={styles.placeholderImage} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}

        {/* Add photo button */}
        <View style={styles.albumItem}>
          <TouchableOpacity
            style={[styles.imageContainer, styles.addPhotoButton]}
            onPress={onAddPhotoPress}
            disabled={isUploading}
          >
            <View style={styles.addPhotoBorder}>
              {isUploading ? (
                <ActivityIndicator size="small" color={theme.white} />
              ) : (
                <Ionicons name="add" size={24} color={theme.white} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      paddingVertical: 16,
    },
    albumGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 16,
    },
    albumItem: {
      width: '30%',
    },
    imageContainer: {
      aspectRatio: 0.75,
      backgroundColor: '#E8DED1',
      borderRadius: Radius.ROUNDED,
    },
    image: {
      width: '100%',
      height: '100%',
      marginBottom: 8,
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    imageTitle: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
    },
    addPhotoBorder: {
      alignSelf: 'center',
      backgroundColor: theme.primary,
      borderRadius: Radius.FULL,
      padding: 10,
    },
    addPhotoButton: {
      backgroundColor: theme.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
