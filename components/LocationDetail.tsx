import { Ionicons } from '@expo/vector-icons' // Assuming you use Expo for icons
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type LocationDetailProps = {
  title: string
  introduction: string
  activities: { name: string; iconName?: string }[]
  images?: string[]
  onBack?: () => void
}

const LocationDetail = ({
  title,
  introduction,
  activities,
  onBack,
}: LocationDetailProps) => {
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
        <Text style={styles.description}>{introduction}</Text>

        <Text style={styles.activityTitle}>Activity</Text>
        <View style={styles.activityGrid}>
          {activities.map((activity, index) => (
            <View style={styles.activityItem} key={index}>
              <View style={styles.activityPlaceholder}>
                <Ionicons
                  name={activity.iconName || 'image-outline'}
                  size={30}
                  color="#A79F93"
                />
              </View>
              <Text style={styles.activityText}>{activity.name}</Text>
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
    gap: 15,
  },
  activityItem: {
    width: '30%',
    backgroundColor: '#EBE2D9',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  activityPlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#DCDCDC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
    textAlign: 'center',
  },
})

export default LocationDetail
