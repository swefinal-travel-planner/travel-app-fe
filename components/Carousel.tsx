import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useCallback, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')

type CarouselProps = {
  images: string[]
  height?: number
  showIndicators?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onImagePress?: (index: number) => void
}

export default function Carousel({
  images,
  height = 256,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onImagePress,
}: Readonly<CarouselProps>) {
  const theme = useThemeStyle()
  const scrollViewRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlayTimer, setAutoPlayTimer] = useState<NodeJS.Timeout | null>(null)

  const imageWidth = screenWidth - 32 // Account for padding
  const styles = createStyles(theme, height, imageWidth)

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: index * imageWidth,
          animated,
        })
      }
    },
    [imageWidth]
  )

  const handleScroll = useCallback(
    (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset.x
      const index = Math.round(contentOffset / imageWidth)
      setCurrentIndex(index)
    },
    [imageWidth]
  )

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length
    scrollToIndex(nextIndex)
  }, [currentIndex, images.length, scrollToIndex])

  const handleIndicatorPress = useCallback(
    (index: number) => {
      scrollToIndex(index)
    },
    [scrollToIndex]
  )

  const handleImagePress = useCallback(
    (index: number) => {
      onImagePress?.(index)
    },
    [onImagePress]
  )

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && images.length > 1) {
      const timer = setInterval(goToNext, autoPlayInterval)
      setAutoPlayTimer(timer)
      return () => {
        if (timer) clearInterval(timer)
      }
    }
  }, [autoPlay, autoPlayInterval, goToNext, images.length])

  // Pause auto-play on user interaction
  const pauseAutoPlay = useCallback(() => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer)
      setAutoPlayTimer(null)
    }
  }, [autoPlayTimer])

  const resumeAutoPlay = useCallback(() => {
    if (autoPlay && images.length > 1 && !autoPlayTimer) {
      const timer = setInterval(goToNext, autoPlayInterval)
      setAutoPlayTimer(timer)
    }
  }, [autoPlay, autoPlayInterval, goToNext, images.length, autoPlayTimer])

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.secondary }]}>
        <View style={styles.imageContainer}>
          <Ionicons name="image-outline" size={48} color={theme.dimText} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={pauseAutoPlay}
        onTouchEnd={resumeAutoPlay}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={`carousel-image-${index}`}
            style={styles.imageContainer}
            onPress={() => handleImagePress(index)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={`indicator-${index}`}
              style={[styles.indicator, index === currentIndex ? styles.activeIndicator : styles.inactiveIndicator]}
              onPress={() => handleIndicatorPress(index)}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const createStyles = (theme: any, height: number, imageWidth: number) =>
  StyleSheet.create({
    container: {
      height,
      borderRadius: Radius.ROUNDED,
      overflow: 'hidden',
      position: 'relative',
    },
    scrollView: {
      flex: 1,
    },
    imageContainer: {
      width: imageWidth,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.ROUNDED,
    },
    indicatorsContainer: {
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeIndicator: {
      backgroundColor: theme.white,
    },
    inactiveIndicator: {
      backgroundColor: theme.white + '80', // 50% opacity
    },
  })
