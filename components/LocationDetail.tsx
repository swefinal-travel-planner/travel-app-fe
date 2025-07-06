import { Radius, Size, SpacingScale } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useMemo } from 'react'
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useThemeStyle } from '@/hooks/useThemeStyle'

import { colorPalettes } from '@/constants/Itheme'

import { FontFamily, FontSize } from '@/constants/font'
import { getGroupIconsFromTypes } from '@/utils/TypeBadges'
import { Carousel } from 'react-native-ui-lib'
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
}

type OpenMapArgs = {
  lat: string | number
  lng: string | number
  label: string
}

const openMap = ({ lat, lng, label }: OpenMapArgs) => {
  const scheme = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`

  if (scheme) {
    Linking.openURL(scheme).catch((err) => console.error('Error opening map: ', err))
  }
}

const LocationDetail = ({ title, properties, types, images, address, onBack, lat, lng }: LocationDetailProps) => {
  const groupIcons = getGroupIconsFromTypes(types)
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

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
            marginBottom: SpacingScale.HUGE,
            marginTop: SpacingScale.MEDIUM,
          }}
          onPress={() => openMap({ lat, lng, label: title })}
        />

        <Text style={styles.subtitle}>Activities</Text>
        <View style={styles.activityGrid}>
          {groupIcons.map((icon, index) => (
            <View style={styles.activityItem} key={index}>
              <View style={styles.activityBox}>
                <View style={styles.iconWrapper}>
                  <Image source={icon.iconSource} style={styles.iconImage} />
                </View>
                <Text style={styles.activityText}>{icon.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
      resizeMode: 'cover',
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
      resizeMode: 'contain',
    },
    activityText: {
      fontSize: Size.SMALL,
      textAlign: 'center',
      fontWeight: '500',
      fontFamily: FontFamily.REGULAR,
    },
  })
export default LocationDetail
