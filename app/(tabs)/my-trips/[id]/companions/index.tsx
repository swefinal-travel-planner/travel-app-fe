import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
export default function TripCompanionsScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const params = useLocalSearchParams()
  const tripId = params.id
  const [companions, setCompanions] = useState([] as { user_id: string; name: string; photo_url: string }[])

  const handleAddCompanions = () => {
    if (!tripId) {
      console.warn('No trip data available for editing.')
      return
    }

    router.push({
      pathname: `/my-trips/${tripId}/companions/modify`,
      params: {
        tripId: tripId,
      },
    })
  }

  useEffect(() => {
    loadCompanions()
  }, [tripId])

  const loadCompanions = useCallback(async () => {
    try {
      const response = await beApi.get(`/trips/${tripId}/members`)
      setCompanions(response.data.data || [])
    } catch (error) {
      console.error('Error loading companions:', error)
    }
  }, [tripId])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          {companions.length > 0 ? (
            companions.map((companion) => (
              <View key={companion.user_id} style={styles.companionItem}>
                <Image source={{ uri: companion.photo_url }} style={styles.image} />
                <Text style={styles.companionName}>{companion.name}</Text>
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
      marginTop: 40,
      borderRadius: Radius.ROUNDED,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 24,
      backgroundColor: theme.secondary,
    },
    companionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginVertical: 8,
    },
    companionName: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.LG,
      color: theme.primary,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 16,
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
