import Pressable from '@/components/Pressable'
import PressableOpacity from '@/components/PressableOpacity'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { getPlaceHolder } from '@/features/trip/utils/AdaptiveImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

type Companion = {
  user_id: string
  name: string
  photo_url: string
  role: string
}

export default function TripCompanionsScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const params = useLocalSearchParams()
  const tripId = params.id
  const [companions, setCompanions] = useState([] as Companion[])

  const handleAddCompanions = () => {
    if (!tripId) {
      console.warn('No trip data available for editing.')
      return
    }

    router.push(`/my-trips/${tripId}/companions/modify`)
  }

  useEffect(() => {
    loadCompanions()
  }, [tripId])

  const loadCompanions = useCallback(async () => {
    try {
      const response = await beApi.get(`/trips/${tripId}/members`)
      setCompanions(response.data.data ?? [])
    } catch (error) {
      console.error('Error loading companions:', error)
    }
  }, [tripId])

  const handleRemoveCompanion = (userId: string) => {
    // Remove a companion from the trip
    // Optionally, you may want to show a confirmation dialog before removing
    const removeCompanion = async (userId: string) => {
      try {
        await beApi.delete(`/trips/${tripId}/members/${userId}`)
        setCompanions((prev) => prev.filter((c) => c.user_id !== userId))
      } catch (error) {
        console.error('Error removing companion:', error)
      }
    }
    removeCompanion(userId)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          {companions.length > 0 ? (
            companions.map((companion) => (
              <View key={companion.user_id} style={styles.companionItem}>
                <Image source={{ uri: companion.photo_url || getPlaceHolder(50, 50) }} style={styles.image} />
                <View style={styles.companionInfo}>
                  <Text style={styles.companionName}>{companion.name}</Text>
                  <Text style={styles.companionRole}>{companion.role}</Text>
                </View>
                {companion.role === 'administrator' ? null : (
                  <PressableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveCompanion(companion.user_id)}
                  >
                    <Ionicons name="trash-outline" size={24} color={theme.primary} />
                  </PressableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyCompanionText}>You're travelling solo.</Text>
          )}
        </ScrollView>
      </View>

      {/* Add Companions Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          title="Add companions"
          style={{ color: theme.white, backgroundColor: theme.primary }}
          onPress={handleAddCompanions}
        ></Pressable>
      </View>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },
    content: {
      flexGrow: 0,
      marginTop: 20,
      borderRadius: Radius.ROUNDED,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 24,
      backgroundColor: theme.secondary,
    },
    companionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 8,
    },
    removeButton: {
      padding: 8,
      borderRadius: Radius.ROUNDED,
    },
    companionName: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.LG,
      color: theme.primary,
    },
    companionRole: {
      fontSize: FontSize.MD,
      color: theme.primary,
      fontFamily: FontFamily.REGULAR,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 16,
    },
    companionInfo: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    emptyCompanionText: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'semibold',
      color: '#563D30',
    },
    buttonContainer: {
      margin: 16,
      backgroundColor: 'transparent',
    },
  })
