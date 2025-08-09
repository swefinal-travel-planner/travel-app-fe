import DayNavigation from '@/components/DayNavigation'
import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripDetails } from '@/hooks/useTripDetails'
import { useTripId } from '@/hooks/useTripId'
import { Ionicons } from '@expo/vector-icons'
import { Camera, CircleLayer, LineLayer, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const EMPTY_STRING = ''
const MAPBOX_TOKEN = Constants.expoConfig?.extra?.mapboxAccessToken ?? EMPTY_STRING

const TripVisualizationScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()

  // State to track if map has loaded
  const [mapLoaded, setMapLoaded] = useState(false)

  // State for the place details modal
  const [selectedPlace, setSelectedPlace] = useState<{
    id: string
    title: string
    address?: string
    image?: string
    placeInfo?: any
  } | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Get trip ID from route parameters
  const tripId = useTripId()

  // Use the trip details hook to get trip data and items
  const { trip, tripItems, groupedItems, activeDay, goToPreviousDay, goToNextDay } = useTripDetails(tripId.toString())

  const handleGoBack = () => {
    router.back()
  }

  const handleViewPlaceDetails = () => {
    if (selectedPlace?.placeInfo) {
      setModalVisible(false)

      const placeInfo = selectedPlace.placeInfo
      // Build the navigation URL with all required parameters
      const params = new URLSearchParams({
        name: placeInfo.name || selectedPlace.title,
        address: placeInfo.address || 'Address not available',
        images: JSON.stringify(placeInfo.images || []),
        properties: placeInfo.properties.join(' '),
        types: placeInfo.type || '',
        lat: placeInfo.location?.lat?.toString() || '0',
        lng: placeInfo.location?.long?.toString() || '0',
        status: 'not_started', // Default status
        tripId: tripId.toString(),
        tripItemId: selectedPlace.id,
      })

      router.push(`/places/${selectedPlace.id}?${params.toString()}`)
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedPlace(null)
  }

  // Display trip name in header, fallback to default text
  const tripName = trip?.title || 'Trip visualization'

  // Create a ref for the camera to control it programmatically
  const cameraRef = useRef<Camera>(null)

  // Get the coordinates of the first item in the current day
  const currentDayCoordinates = useMemo(() => {
    if (groupedItems.length > 0 && groupedItems[activeDay]?.spots?.length > 0) {
      const firstSpot = groupedItems[activeDay].spots[0]
      // Find the corresponding trip item to get location data
      const tripItem = tripItems.find((item) => item.placeID === firstSpot.placeID)

      if (tripItem?.placeInfo?.location) {
        return [tripItem.placeInfo.location.long, tripItem.placeInfo.location.lat]
      }
    }
    // Default to Ho Chi Minh City coordinates if no location found
    return [106.7009, 10.7769]
  }, [groupedItems, activeDay, tripItems])

  // Get current day's spots with valid coordinates for markers
  const currentDayMarkers = useMemo(() => {
    if (groupedItems.length > 0 && groupedItems[activeDay]?.spots?.length > 0) {
      const markers = groupedItems[activeDay].spots
        .map((spot, index) => {
          const tripItem = tripItems.find((item) => item.placeID === spot.placeID)
          if (tripItem?.placeInfo?.location) {
            return {
              id: spot.placeID,
              title: spot.name || 'Unknown Place',
              coordinate: [tripItem.placeInfo.location.long, tripItem.placeInfo.location.lat],
              orderInDay: spot.orderInDay || index + 1,
              timeSlot: spot.timeSlot,
            }
          }
          return null
        })
        .filter((marker): marker is NonNullable<typeof marker> => marker !== null) // Type-safe filter

      // Deduplicate markers by placeID to avoid duplicates
      const uniqueMarkers = markers.filter((marker, index, self) => index === self.findIndex((m) => m.id === marker.id))

      return uniqueMarkers
    }
    return []
  }, [groupedItems, activeDay, tripItems])

  // Recenter the camera when activeDay or coordinates change
  useEffect(() => {
    // Only recenter if we have valid coordinates and they're not the default coordinates
    if (
      cameraRef.current &&
      currentDayCoordinates &&
      !(currentDayCoordinates[0] === 106.7009 && currentDayCoordinates[1] === 10.7769)
    ) {
      cameraRef.current.setCamera({
        centerCoordinate: currentDayCoordinates,
        zoomLevel: 13,
        animationDuration: 1000, // Smooth transition
      })
    }
  }, [currentDayCoordinates])

  // Handle marker press
  const handleMarkerPress = (markerId: string, markerTitle: string) => {
    // Find the trip item details
    const tripItem = tripItems.find((item) => item.placeID === markerId)

    if (tripItem?.placeInfo) {
      setSelectedPlace({
        id: markerId,
        title: markerTitle,
        address: tripItem.placeInfo.address || 'Address not available',
        image: tripItem.placeInfo.images?.[0] || undefined,
        placeInfo: tripItem.placeInfo,
      })
      setModalVisible(true)
    }
  }

  // Create GeoJSON data for markers
  const markersGeoJSON = useMemo(() => {
    const features = currentDayMarkers.map((marker) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: marker.coordinate,
      },
      properties: {
        id: marker.id,
        title: marker.title,
        orderInDay: marker.orderInDay,
        timeSlot: marker.timeSlot,
        markerType: 'trip-destination',
      },
    }))

    return {
      type: 'FeatureCollection' as const,
      features,
    }
  }, [currentDayMarkers])

  // Create GeoJSON data for route lines using Mapbox Directions API
  const routeGeoJSON = useMemo(() => {
    if (currentDayMarkers.length < 2) {
      return null // No route needed if less than 2 markers
    }

    // For now, return straight lines - we'll fetch real routes separately
    const sortedMarkers = [...currentDayMarkers].sort((a, b) => a.orderInDay - b.orderInDay)
    const coordinates = sortedMarkers.map((marker) => marker.coordinate)

    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates,
          },
          properties: {},
        },
      ],
    }
  }, [currentDayMarkers])

  // State to store real route geometry from Mapbox Directions API
  const [realRouteGeoJSON, setRealRouteGeoJSON] = useState<any>(null)

  // Fetch real route geometry when markers change
  useEffect(() => {
    const fetchRealRoute = async () => {
      if (currentDayMarkers.length < 2) {
        setRealRouteGeoJSON(null)
        return
      }

      try {
        // Sort markers by orderInDay
        const sortedMarkers = [...currentDayMarkers].sort((a, b) => a.orderInDay - b.orderInDay)

        // Create waypoints string for Mapbox Directions API
        const waypoints = sortedMarkers.map((marker) => `${marker.coordinate[0]},${marker.coordinate[1]}`).join(';')

        if (!MAPBOX_TOKEN) {
          console.warn('Mapbox token not available, using straight line route')
          setRealRouteGeoJSON(routeGeoJSON)
          return
        }

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${waypoints}?` +
            `geometries=geojson&access_token=${MAPBOX_TOKEN}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch route')
        }

        const data = await response.json()

        if (data.routes && data.routes.length > 0) {
          const routeGeometry = data.routes[0].geometry

          // Make sure we're only getting LineString geometry, not Points
          if (routeGeometry.type !== 'LineString') {
            console.warn('Expected LineString geometry, got:', routeGeometry.type)
            setRealRouteGeoJSON(routeGeoJSON) // Fallback to straight lines
            return
          }

          const cleanRouteGeoJSON = {
            type: 'FeatureCollection' as const,
            features: [
              {
                type: 'Feature' as const,
                geometry: {
                  type: 'LineString' as const,
                  coordinates: routeGeometry.coordinates,
                },
                properties: {
                  routeType: 'walking-directions',
                },
              },
            ],
          }

          setRealRouteGeoJSON(cleanRouteGeoJSON)
        } else {
          console.log('No routes found in API response')
        }
      } catch (error) {
        console.error('Error fetching real route:', error)
        // Fallback to straight line route
        setRealRouteGeoJSON(routeGeoJSON)
      }
    }

    fetchRealRoute()
  }, [currentDayMarkers, routeGeoJSON])

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{tripName}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Day Navigation */}
      {groupedItems.length > 0 && (
        <DayNavigation
          groupedItems={groupedItems}
          activeDay={activeDay}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
        />
      )}

      <View style={styles.mapContainer}>
        <MapView
          style={{ flex: 1 }}
          logoEnabled={true}
          scaleBarPosition={{ top: 8, left: 16 }}
          onDidFinishLoadingMap={() => setMapLoaded(true)}
          onDidFailLoadingMap={() => setMapLoaded(false)}
        >
          <Camera ref={cameraRef} centerCoordinate={currentDayCoordinates} zoomLevel={13} />

          {/* Route lines connecting the trip markers - rendered first to appear below markers */}
          {mapLoaded && realRouteGeoJSON && (
            <ShapeSource id="trip-route" shape={realRouteGeoJSON}>
              <LineLayer
                id="route-line"
                style={{
                  lineColor: '#1d93b3ff',
                  lineWidth: 4,
                  lineOpacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </ShapeSource>
          )}

          {/* Trip markers using GeoJSON ShapeSource - rendered second to appear above route */}
          {mapLoaded && currentDayMarkers.length > 0 && (
            <ShapeSource
              id="trip-markers"
              shape={markersGeoJSON}
              onPress={(event) => {
                if (event?.features?.[0]?.properties) {
                  const props = event.features[0].properties
                  handleMarkerPress(props.id, props.title)
                }
              }}
            >
              {/* Circle markers for the spots */}
              <CircleLayer
                id="marker-circles"
                aboveLayerID="route-line"
                style={{
                  circleRadius: 15,
                  circleColor: theme.primary,
                  circleStrokeColor: 'white',
                  circleStrokeWidth: 3,
                  circleOpacity: 1,
                }}
              />
              {/* Number labels on the markers */}
              <SymbolLayer
                id="marker-labels"
                aboveLayerID="marker-circles"
                style={{
                  textField: ['get', 'orderInDay'],
                  textSize: 14,
                  textColor: 'white',
                  textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
                  textHaloColor: 'rgba(0,0,0,0.3)',
                  textHaloWidth: 1,
                }}
              />
            </ShapeSource>
          )}
        </MapView>

        {/* Place Details Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleCloseModal}>
            <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => {}}>
              {/* Gray bar at top */}
              <View style={styles.modalHandle} />

              {selectedPlace && (
                <>
                  {/* Place image */}
                  {selectedPlace.image && (
                    <Image source={{ uri: selectedPlace.image }} style={styles.placeImage} resizeMode="cover" />
                  )}

                  {/* Place details */}
                  <View style={styles.placeDetails}>
                    <Text style={[styles.placeTitle, { color: theme.text }]}>{selectedPlace.title}</Text>
                    <Text style={[styles.placeAddress, { color: theme.dimText }]}>{selectedPlace.address}</Text>

                    <Pressable
                      title="View details"
                      onPress={handleViewPlaceDetails}
                      style={{ color: theme.white, backgroundColor: theme.primary }}
                    />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  )
}

export default TripVisualizationScreen

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
      paddingTop: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    mapContainer: {
      width: '100%',
      flex: 1,
      overflow: 'hidden',
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      textAlign: 'center',
    },
    placeholder: {
      width: 40,
    },
    debugOverlay: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 8,
      borderRadius: 4,
      maxWidth: 200,
    },
    debugText: {
      color: 'white',
      fontSize: 12,
      fontFamily: FontFamily.REGULAR,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 8,
      maxHeight: '50%',
    },
    modalHandle: {
      width: 60,
      height: 6,
      backgroundColor: '#D1D5DB',
      borderRadius: Radius.FULL,
      alignSelf: 'center',
      marginTop: 4,
      marginBottom: 16,
    },
    placeImage: {
      marginHorizontal: 24,
      marginTop: 8,
      height: 200,
      backgroundColor: theme.background,
      borderRadius: Radius.ROUNDED,
    },
    placeDetails: {
      padding: 20,
    },
    placeTitle: {
      fontSize: FontSize.XXL,
      fontFamily: FontFamily.BOLD,
      marginBottom: 8,
    },
    placeAddress: {
      fontSize: 16,
      fontFamily: FontFamily.REGULAR,
      marginBottom: 20,
      lineHeight: 22,
    },
    viewDetailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: Radius.ROUNDED,
      gap: 8,
    },
    viewDetailsText: {
      fontSize: 16,
      fontFamily: FontFamily.BOLD,
    },
  })
