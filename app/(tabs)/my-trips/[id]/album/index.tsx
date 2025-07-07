import AlbumGrid from '@/components/Album/AlbumGrid'
import ErrorState from '@/components/Album/ErrorState'
import ImageGalleryModal from '@/components/Album/ImageGalleryModal'
import LoadingState from '@/components/Album/LoadingState'
import ImageActionSheet from '@/components/ImageActionSheet'
import { useToast } from '@/components/ToastContext'
import { useGetTripImages } from '@/features/trip/presentation/state/useGetTripImages'
import { usePostTripImages } from '@/features/trip/presentation/state/usePostTripImages'
import { useTripId } from '@/hooks/useTripId'
import { uploadImage2Cloud } from '@/utils/uploadImage2Cloud'
import React, { useState } from 'react'
import { Alert, SafeAreaView, StyleSheet } from 'react-native'

export default function AlbumScreen() {
  const tripId = useTripId()
  const { showToast } = useToast()

  if (!tripId) {
    console.log(`Invalid tripId: ${tripId}`) // Log an error if tripId is not valid
  }

  const [showActionSheet, setShowActionSheet] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const { tripImages: images, isLoading: getTripImageIsLoading, error: getTripImageError } = useGetTripImages(tripId)
  const { postTripImage, isLoading: postImageIsLoading, error: postImageError } = usePostTripImages()

  // Handle post image error
  React.useEffect(() => {
    if (postImageError) {
      console.log('Error:', postImageError, ' File:', __filename)
      Alert.alert('Error', 'Failed to upload image. Please try again.', [{ text: 'OK', onPress: () => {} }])
    }
  }, [postImageError])

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImageIndex(null)
  }

  const goToNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const goToPreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1)
    // Force a re-render which will trigger the query to run again
  }

  const handleAddPhoto = () => {
    setShowActionSheet(true)
  }

  const handleImageUpload = async (uri: string) => {
    if (tripId && uri) {
      try {
        await postTripImage(tripId, (await uploadImage2Cloud(uri, 'trip_images')) ?? '')
        showToast({
          type: 'success',
          message: 'Image uploaded successfully!',
          position: 'bottom',
        })
        setShowActionSheet(false)
      } catch (error) {
        console.error('Failed to upload image:', error)
        Alert.alert('Error', 'Failed to upload image. Please try again.')
      }
    }
  }

  // Loading state
  if (getTripImageIsLoading) {
    return <LoadingState />
  }

  // Error state
  if (getTripImageError) {
    return <ErrorState onRetry={handleRetry} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <AlbumGrid
        images={images}
        onImagePress={openImageModal}
        onAddPhotoPress={handleAddPhoto}
        isUploading={postImageIsLoading}
      />

      <ImageGalleryModal
        visible={selectedImageIndex !== null}
        images={images}
        selectedIndex={selectedImageIndex}
        onClose={closeImageModal}
        onNext={goToNextImage}
        onPrevious={goToPreviousImage}
      />

      <ImageActionSheet
        visible={showActionSheet}
        onDismiss={() => setShowActionSheet(false)}
        onImagePicked={handleImageUpload}
        allowsEditing={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
  },
})
