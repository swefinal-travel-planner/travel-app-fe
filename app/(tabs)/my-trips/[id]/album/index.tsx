import ImageActionSheet from '@/components/ImageActionSheet'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useGetTripImages } from '@/features/trip/presentation/state/useGetTripImages'
import { usePostTripImages } from '@/features/trip/presentation/state/usePostTripImages'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripId } from '@/hooks/useTripId'
import { uploadImage2Cloud } from '@/utils/uploadImage2Cloud'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function AlbumScreen() {
  const tripId = useTripId()

  const router = useRouter()

  if (!tripId) {
    console.log(`Invalid tripId: ${tripId}`) // Log an error if tripId is not valid
  }

  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [showActionSheet, setShowActionSheet] = useState(false)

  const { tripImages: images, isLoading: getTripImageIsLoading, error: getTripImageError } = useGetTripImages(tripId)
  const { postTripImage, isLoading, error } = usePostTripImages()

  // log the trip images
  console.log('object')
  console.log(images)

  return (
    <SafeAreaView style={styles.container}>
      {/* Album grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.albumGrid}>
          {/* Album items */}
          {images.map((item) => (
            <View key={item.id} style={styles.albumItem}>
              <TouchableOpacity style={styles.imageContainer}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Image source={require('@/assets/images/alligator.jpg')} style={styles.placeholderImage} />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.imageTitle}>{'Hello'}</Text>
            </View>
          ))}

          {/* Add photo button */}
          <View style={styles.albumItem}>
            <TouchableOpacity
              style={[styles.imageContainer, styles.addPhotoButton]}
              onPress={() => setShowActionSheet(true)}
            >
              <View style={styles.addPhotoBorder}>
                <Ionicons name="add" size={24} color={theme.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ImageActionSheet
        visible={showActionSheet}
        onDismiss={() => setShowActionSheet(false)}
        onImagePicked={async (uri) => {
          if (tripId && uri) {
            await postTripImage(tripId, (await uploadImage2Cloud(uri, 'trip_images')) ?? '')
            setShowActionSheet(false)
          }
        }}
      />
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 22,
    },
    scrollView: {
      flex: 1,
      paddingVertical: 16,
    },
    albumGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    albumItem: {
      width: '30%',
      marginBottom: 24,
    },
    imageContainer: {
      aspectRatio: 0.75,
      backgroundColor: '#E8DED1',
      borderRadius: Radius.ROUNDED,
    },
    image: {
      width: '100%',
      height: '100%',
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
