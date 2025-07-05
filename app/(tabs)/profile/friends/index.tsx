import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
export default function TripFriendsScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const params = useLocalSearchParams()
  const tripId = params.id

  const [friends, setFriends] = useState([] as { id: string; username: string; imageURL: string }[])

  const handleAddFriends = () => {
    router.push(`/profile/friends/modify`)
  }

  const handleGoBack = () => {
    router.back()
  }

  useEffect(() => {
    loadFriends()
  }, [])

  const loadFriends = useCallback(async () => {
    try {
      const response = await beApi.get(`/friends`)
      setFriends(response.data.data || [])
    } catch (error) {
      console.error('Error loading friends:', error)
    }
  }, [tripId])

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <View key={friend.id} style={styles.friendItem}>
                <Image source={{ uri: friend.imageURL }} style={styles.image} />
                <Text style={styles.friendName}>{friend.username}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyFriendText}>It's looking empty. Find some new friends to travel with!</Text>
          )}
        </ScrollView>
      </View>

      {/* Add Friends Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          title="Add friends"
          style={{ color: theme.white, backgroundColor: theme.primary }}
          onPress={handleAddFriends}
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
      paddingTop: 40,
    },
    content: {
      flexGrow: 0,
      borderRadius: Radius.ROUNDED,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 24,
      backgroundColor: theme.secondary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      padding: 8,
    },
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginVertical: 8,
    },
    friendName: {
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
    emptyFriendText: {
      textAlign: 'center',
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.LG,
      color: theme.text,
    },
    buttonContainer: {
      margin: 16,
      backgroundColor: 'transparent',
    },
  })
