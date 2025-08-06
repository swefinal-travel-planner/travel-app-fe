import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { ReactNode, useCallback, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')

type CarouselProps = {
  // For image carousel
  images?: string[]
  // For component carousel
  children?: ReactNode
  // Common props
  height?: number
  showIndicators?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onImagePress?: (index: number) => void
  onItemPress?: (index: number) => void
  // Width configuration
  itemWidth?: number
  containerPadding?: number
  useContainerWidth?: boolean // Use container width instead of screen width
  itemSpacing?: number // Space between carousel items
  indicatorsOutside?: boolean // Position indicators outside the carousel
}

export default function Carousel({
  images,
  children,
  height = 256,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onImagePress,
  onItemPress,
  itemWidth,
  containerPadding = 16,
  useContainerWidth = false,
  itemSpacing = 0,
  indicatorsOutside = false,
}: Readonly<CarouselProps>) {
  const theme = useThemeStyle()
  const scrollViewRef = useRef<ScrollView>(null)
  const containerRef = useRef<View>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlayTimer, setAutoPlayTimer] = useState<NodeJS.Timeout | null>(null)
  const [containerWidth, setContainerWidth] = useState(screenWidth)

  // Determine if we're using images or children
  const isImageCarousel = images && images.length > 0
  const isComponentCarousel = children && React.Children.count(children) > 0

  // Calculate item width - if itemWidth is provided, use it directly
  // Otherwise, use the appropriate width (container or screen) minus container padding and spacing
  const availableWidth = useContainerWidth ? containerWidth : screenWidth
  const calculatedItemWidth = itemWidth || availableWidth - containerPadding * 2 - itemSpacing

  const styles = createStyles(theme, height, calculatedItemWidth, itemSpacing, indicatorsOutside)

  // Get the total number of items
  const totalItems = isImageCarousel ? images!.length : React.Children.count(children)

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: index * calculatedItemWidth,
          animated,
        })
      }
    },
    [calculatedItemWidth]
  )

  const handleScroll = useCallback(
    (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset.x
      const index = Math.round(contentOffset / calculatedItemWidth)
      setCurrentIndex(index)
    },
    [calculatedItemWidth]
  )

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalItems
    scrollToIndex(nextIndex)
  }, [currentIndex, totalItems, scrollToIndex])

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

  const handleItemPress = useCallback(
    (index: number) => {
      onItemPress?.(index)
    },
    [onItemPress]
  )

  const handleContainerLayout = useCallback(
    (event: any) => {
      if (useContainerWidth) {
        const { width } = event.nativeEvent.layout
        setContainerWidth(width)
      }
    },
    [useContainerWidth]
  )

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && totalItems > 1) {
      const timer = setInterval(goToNext, autoPlayInterval)
      setAutoPlayTimer(timer)
      return () => {
        if (timer) clearInterval(timer)
      }
    }
  }, [autoPlay, autoPlayInterval, goToNext, totalItems])

  // Pause auto-play on user interaction
  const pauseAutoPlay = useCallback(() => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer)
      setAutoPlayTimer(null)
    }
  }, [autoPlayTimer])

  const resumeAutoPlay = useCallback(() => {
    if (autoPlay && totalItems > 1 && !autoPlayTimer) {
      const timer = setInterval(goToNext, autoPlayInterval)
      setAutoPlayTimer(timer)
    }
  }, [autoPlay, autoPlayInterval, goToNext, totalItems, autoPlayTimer])

  // Handle empty state
  if ((!isImageCarousel && !isComponentCarousel) || totalItems === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.secondary }]}>
        <View style={styles.itemContainer}>
          <Ionicons name="image-outline" size={48} color={theme.dimText} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container} ref={containerRef} onLayout={handleContainerLayout}>
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
        contentContainerStyle={styles.scrollContent}
      >
        {isImageCarousel
          ? // Render images
            images!.map((image, index) => (
              <TouchableOpacity
                key={`carousel-image-${index}`}
                style={styles.itemContainer}
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
            ))
          : // Render components
            React.Children.map(children, (child, index) => (
              <TouchableOpacity
                key={`carousel-item-${index}`}
                style={styles.itemContainer}
                onPress={() => handleItemPress(index)}
                activeOpacity={0.9}
                disabled={!onItemPress} // Disable if no onItemPress handler
              >
                {child}
              </TouchableOpacity>
            ))}
      </ScrollView>

      {/* Indicators */}
      {showIndicators && totalItems > 1 && (
        <View style={styles.indicatorsContainer}>
          {Array.from({ length: totalItems }).map((_, index) => (
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

const createStyles = (theme: any, height: number, itemWidth: number, itemSpacing: number, indicatorsOutside: boolean) =>
  StyleSheet.create({
    container: {
      height,
      width: '100%',
      borderRadius: Radius.ROUNDED,
      overflow: 'hidden',
      position: 'relative',
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    scrollContent: {
      // Remove alignItems center to prevent width issues
    },
    itemContainer: {
      width: itemWidth,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 0, // Ensure no horizontal padding
      marginRight: itemSpacing, // Add spacing between items
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.ROUNDED,
    },
    indicatorsContainer: {
      position: 'absolute',
      bottom: indicatorsOutside ? 0 : 16,
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
      backgroundColor: indicatorsOutside ? theme.primary : theme.white,
    },
    inactiveIndicator: {
      backgroundColor: indicatorsOutside ? theme.primary + '40' : theme.white + '80',
    },
  })
