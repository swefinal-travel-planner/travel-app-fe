import { Radius, Size, SpacingScale } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useMemo } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useThemeStyle } from '@/hooks/useThemeStyle'

import { colorPalettes } from '@/styles/Itheme'

import { getGroupIconsFromTypes } from '@/utils/TypeBadges'

type LocationDetailProps = {
  title: string
  properties: string
  types: string
  images?: string[]
  onBack?: () => void
}

const LocationDetail = ({
  title,
  properties,
  types,
  onBack,
}: LocationDetailProps) => {
  const groupIcons = getGroupIconsFromTypes(types)
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#5C6F5A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Carousel Placeholder */}
        <View style={styles.imageCarousel}>
          <TouchableOpacity style={styles.carouselArrow}>
            <Ionicons name="arrow-back" size={24} color="#A79F93" />
          </TouchableOpacity>
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={50} color="#A79F93" />
          </View>
          <TouchableOpacity style={styles.carouselArrow}>
            <Ionicons name="arrow-forward" size={24} color="#A79F93" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Introduction</Text>
        <Text style={styles.description}>{properties}</Text>

        <Text style={styles.activityTitle}>Badges</Text>
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
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      paddingHorizontal: SpacingScale.XXLARGE,
      paddingBottom: SpacingScale.XXLARGE,
    },
    imageCarousel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.brown,
      borderRadius: Radius.NORMAL,
      height: 200,
      marginBottom: SpacingScale.XXLARGE,
      paddingHorizontal: SpacingScale.XLARGE,
    },
    carouselArrow: {
      padding: SpacingScale.MEDIUM,
    },
    placeholderImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: Size.XS,
      fontWeight: 'bold',
      color: theme.green,
      marginBottom: SpacingScale.MEDIUM,
    },
    subtitle: {
      fontSize: Size.MEDIUM,
      fontWeight: '600',
      color: theme.dimText,
      marginBottom: SpacingScale.MEDIUM,
    },
    description: {
      fontSize: Size.NORMAL,
      color: theme.black,
      lineHeight: 24,
      marginBottom: SpacingScale.XXLARGE,
    },
    activityTitle: {
      fontSize: Size.MEDIUM,
      fontWeight: '600',
      color: theme.green,
      marginBottom: SpacingScale.XLARGE,
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
      backgroundColor: theme.brown,
      borderRadius: Radius.MEDIUM,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: SpacingScale.MEDIUM,
    },
    iconWrapper: {
      width: '60%',
      height: '60%',
      backgroundColor: theme.white,
      borderRadius: Radius.NORMAL,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SpacingScale.NORMAL,
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
    },
  })
export default LocationDetail
