import { useToast } from '@/components/ToastContext'
import { colorPalettes } from '@/constants/Itheme'
import { FontFamily, FontSize } from '@/constants/font'
import { Radius, Size, SpacingScale } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { getGroupIconsFromTypes } from '@/utils/TypeBadges'
import { uploadImage2Cloud } from '@/utils/uploadImage2Cloud'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useEffect, useMemo, useState } from 'react'
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Carousel } from 'react-native-ui-lib'
import ImageActionSheet from './ImageActionSheet'
import Pressable from './Pressable'

type LocationDetailProps = {
  title: string
  properties: string
  lat: string | number
  lng: string | number
  types: string
  images?: string[]
  address?: string
  onBack?: () => void
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled' | null
  tripId?: string | null
  tripItemId?: string | null
}

type OpenMapArgs = {
  lat: string | number
  lng: string | number
  label: string
}

type CheckinImage = {
  id: number
  tripId: string
  tripItemID: string
  imageUrl: string
}

const openMap = ({ lat, lng, label }: OpenMapArgs) => {
  const scheme = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`

  if (scheme) {
    Linking.openURL(scheme).catch((err) => console.error('Error opening map: ', err))
  }
}

const LocationDetail = ({
  title,
  properties,
  types,
  images,
  address,
  onBack,
  lat,
  lng,
  status,
  tripId,
  tripItemId,
}: LocationDetailProps) => {
  const groupIcons = getGroupIconsFromTypes(types)
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const [showActionSheet, setShowActionSheet] = useState(false)
  const { showToast } = useToast()
  const [refreshKey, setRefreshKey] = useState(0)

  const [checkinImages, setCheckinImages] = useState<CheckinImage[]>([])
  const [loadingImages, setLoadingImages] = useState(false)

  const handleImageUpload = async (uri: string) => {
    if (!tripId || !tripItemId || !uri) return

    try {
      // 1. Upload to cloud
      const cloudUrl = await uploadImage2Cloud(uri, 'trip_images')
      if (!cloudUrl) throw new Error('Cloud upload failed')

      // 2. Send cloud URL to backend
      const response = await beApi.post(`/trips/${tripId}/images`, {
        imageUrl: cloudUrl,
        tripItemID: Number(tripItemId),
      })
      setShowActionSheet(false)
      if (response.status == 204) {
        showToast({
          type: 'success',
          message: 'Image uploaded successfully!',
          position: 'bottom',
        })
      }
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error('Failed to upload image:', error)
      showToast({
        type: 'error',
        message: 'Failed to upload image. Please try again.',
        position: 'bottom',
      })
    }
  }

  useEffect(() => {
    const fetchCheckinImages = async () => {
      if (!tripId || !tripItemId) return

      try {
        setLoadingImages(true)
        const response = await beApi.get(`/trips/${tripId}/trip-items/${tripItemId}/images`)
        setCheckinImages(response.data.data || [])
      } catch (error) {
        console.error('Error fetching check-in images:', error)
      } finally {
        setLoadingImages(false)
      }
    }

    fetchCheckinImages()
  }, [tripId, tripItemId, refreshKey])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Carousel
          pagingEnabled
          containerPaddingVertical={8}
          initialPage={0}
          style={{
            borderRadius: Radius.ROUNDED,
          }}
          loop
          containerStyle={{
            marginVertical: SpacingScale.XXLARGE,
            borderRadius: Radius.ROUNDED,
            height: 256,
          }}
          containerMarginHorizontal={0}
          pageControlPosition={Carousel.pageControlPositions.UNDER}
          pageControlProps={{ color: theme.primary }}
        >
          {images?.map((item, index) => <Image key={index} style={styles.placeImage} source={{ uri: item }} />) || []}
        </Carousel>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.addressTitle}>{address}</Text>
        <Text style={styles.description}>{properties}</Text>

        <Pressable
          title="Show in Maps"
          style={{
            backgroundColor: theme.primary,
            color: theme.white,
            marginVertical: SpacingScale.LARGE,
          }}
          onPress={() => openMap({ lat, lng, label: title })}
        />

        <Text style={styles.subtitle}>Activities</Text>
        <View style={styles.activityGrid}>
          {groupIcons.map((icon, index) => (
            <View style={styles.activityItem} key={index}>
              <View style={styles.activityBox}>
                <View style={styles.iconWrapper}>
                  <Image source={icon.iconSource} contentFit="contain" style={styles.iconImage} />
                </View>
                <Text style={styles.activityText}>{icon.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {status && (
          <Pressable
            title="Checkin"
            disabled={status === 'completed' || status === 'cancelled' || status === 'not_started'}
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
              marginVertical: SpacingScale.LARGE,
            }}
            onPress={() => {
              setShowActionSheet(true)
            }}
          />
        )}

        {status && (
          <>
            <Text style={styles.subtitle}>Check-in Photos</Text>
            {loadingImages ? (
              <Text style={styles.loadingText}>Loading images...</Text>
            ) : checkinImages.length === 0 ? (
              <Text style={styles.emptyText}>No check-in photos yet.</Text>
            ) : (
              <View style={styles.imageGrid}>
                {checkinImages.map((image, index) => (
                  <Image key={index} source={image.imageUrl} contentFit="cover" style={styles.checkinImage} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <ImageActionSheet
        visible={showActionSheet}
        onDismiss={() => setShowActionSheet(false)}
        onImagePicked={handleImageUpload}
        allowsEditing={false}
      />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },
    header: {
      paddingTop: SpacingScale.GIGANTIC,
      paddingHorizontal: SpacingScale.XXLARGE,
      backgroundColor: theme.white,
    },
    backButton: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      paddingHorizontal: SpacingScale.XXLARGE,
      paddingBottom: SpacingScale.XXLARGE,
    },
    imageCarousel: {
      width: '100%',
      borderRadius: Radius.ROUNDED,
      marginVertical: 24,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
    },
    placeImage: {
      flex: 1,
      borderRadius: Radius.ROUNDED,
    },
    title: {
      fontFamily: FontFamily.BOLD,
      fontSize: Size.XS,
      color: theme.primary,
      marginVertical: SpacingScale.MEDIUM,
    },
    subtitle: {
      fontSize: Size.MEDIUM,
      fontWeight: '600',
      color: theme.dimText,
      marginVertical: SpacingScale.MEDIUM,
      fontFamily: FontFamily.BOLD,
    },
    description: {
      fontSize: Size.NORMAL,
      color: theme.black,
      lineHeight: 24,
      marginBottom: SpacingScale.XXLARGE,
      fontFamily: FontFamily.REGULAR,
    },
    addressTitle: {
      fontSize: FontSize.LG,
      color: theme.dimText,
      marginBottom: SpacingScale.XLARGE,
      fontFamily: FontFamily.REGULAR,
    },
    activityGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 12,
      marginBottom: SpacingScale.LARGE,
    },
    activityItem: {
      width: 100,
      alignItems: 'center',
    },
    activityBox: {
      width: 100,
      height: 100,
      backgroundColor: theme.background,
      borderRadius: Radius.MEDIUM,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: SpacingScale.MEDIUM,
    },
    iconWrapper: {
      width: '60%',
      height: '55%',
      borderRadius: Radius.NORMAL,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconImage: {
      width: 36,
      height: 36,
    },
    activityText: {
      fontSize: Size.SMALL,
      textAlign: 'center',
      fontWeight: '500',
      fontFamily: FontFamily.REGULAR,
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      rowGap: 12,
      columnGap: 6,
      marginBottom: SpacingScale.XXLARGE,
    },
    checkinImage: {
      width: '32%',
      aspectRatio: 1,
      borderRadius: Radius.MEDIUM,
      marginBottom: 12,
      borderWidth: 1,
      height: 180,
    },
    loadingText: {
      fontSize: Size.NORMAL,
      color: theme.dimText,
      fontFamily: FontFamily.REGULAR,
      marginBottom: SpacingScale.MEDIUM,
    },
    emptyText: {
      fontSize: Size.NORMAL,
      color: theme.dimText,
      fontFamily: FontFamily.ITALIC,
      marginBottom: SpacingScale.MEDIUM,
    },
  })
export default LocationDetail
