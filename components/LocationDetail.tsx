import { Ionicons } from '@expo/vector-icons'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  imageCarousel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EBE2D9',
    borderRadius: 8,
    height: 200,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  carouselArrow: {
    padding: 10,
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C6F5A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C6F5A',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C6F5A',
    marginBottom: 15,
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
    backgroundColor: '#EBE2D9',
    borderRadius: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  iconWrapper: {
    width: '60%',
    height: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  activityText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
})
export default LocationDetail
