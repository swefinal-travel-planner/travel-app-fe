import Pressable from '@/components/Pressable'
import PressableOpacity from '@/components/PressableOpacity'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { getPlaceHolder } from '@/features/trip/utils/AdaptiveImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TripFriendsScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const params = useLocalSearchParams()
  const tripId = params.id

  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
  const [friends, setFriends] = useState([] as { id: string; username: string; imageURL: string }[])
  const [friendRequests, setFriendRequests] = useState(
    [] as { id: string; receiverImageURL: string; receiverUsername: string }[]
  )

  const handleAddFriends = () => {
    router.push(`/profile/friends/modify`)
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    Alert.alert('Remove friend', `Are you sure you want to remove ${friendName} from your friends list?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await beApi.delete(`/friends/${friendId}`)
            setFriends((prev) => prev.filter((friend) => friend.id !== friendId))
          } catch (error) {
            console.error('Error removing friend:', error)
          }
        },
      },
    ])
  }

  const handleCancelRequest = async (invitationId: string, receiverName: string) => {
    Alert.alert('Cancel friend request', `Are you sure you want to cancel your friend request to ${receiverName}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await beApi.delete(`/invitation-friends/${invitationId}`)
            setFriendRequests((prev) => prev.filter((request) => request.id !== invitationId))
          } catch (error) {
            console.error('Error canceling friend request:', error)
          }
        },
      },
    ])
  }

  useEffect(() => {
    loadFriends()
    loadFriendRequests()
  }, [])

  const loadFriends = useCallback(async () => {
    try {
      const response = await beApi.get(`/friends`)
      setFriends(response.data.data || [])
    } catch (error) {
      console.error('Error loading friends:', error)
    }
  }, [tripId])

  const loadFriendRequests = useCallback(async () => {
    try {
      const response = await beApi.get(`/invitation-friends/requested`)
      setFriendRequests(response.data.data || [])
    } catch (error) {
      console.error('Error loading friend requests:', error)
    }
  }, [])

  // Custom tab label component matching trip details layout
  const CustomTabLabel = ({ label, focused }: { label: string; focused: boolean }) => (
    <View style={styles.tabContainer}>
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>{label}</Text>
      {focused && <View style={styles.tabIndicator} />}
    </View>
  )

  const IconButton = ({
    icon,
    onPress,
    color = theme.error,
  }: {
    icon: keyof typeof Ionicons.glyphMap
    onPress: () => void
    color?: string
  }) => (
    <PressableOpacity onPress={onPress} style={styles.iconButton}>
      <Ionicons name={icon} size={20} color={color} />
    </PressableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Friends</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigationContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('friends')}>
          <CustomTabLabel label="Friends" focused={activeTab === 'friends'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('requests')}>
          <CustomTabLabel label="Sent requests" focused={activeTab === 'requests'} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          {activeTab === 'friends' ? (
            friends.length > 0 ? (
              friends.map((friend) => (
                <View key={friend.id} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Image source={{ uri: friend.imageURL || getPlaceHolder(50, 50) }} style={styles.image} />
                    <Text style={styles.itemName}>{friend.username}</Text>
                  </View>
                  <IconButton
                    icon="person-remove-outline"
                    onPress={() => handleRemoveFriend(friend.id, friend.username)}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>It's looking empty. Find some new friends to travel with!</Text>
            )
          ) : friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <View key={request.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Image source={{ uri: request.receiverImageURL || getPlaceHolder(50, 50) }} style={styles.image} />
                  <Text style={styles.itemName}>{request.receiverUsername}</Text>
                </View>
                <Pressable
                  title="Cancel"
                  style={{ color: theme.white, backgroundColor: theme.error }}
                  onPress={() => handleCancelRequest(request.id, request.receiverUsername)}
                  size="small"
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No friend requests sent.</Text>
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
      borderRadius: 0,
      paddingVertical: 8,
      paddingHorizontal: 24,
      marginHorizontal: 0,
      backgroundColor: 'transparent',
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
    headerTitle: {
      fontSize: 20,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      textAlign: 'center',
    },
    placeholder: {
      width: 40,
    },
    tabNavigationContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.white,
      height: 60,
      elevation: 0,
      borderBottomWidth: 0,
    },
    tabButton: {
      flex: 1,
      height: 50,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: '100%',
    },
    tabBarLabel: {
      fontSize: FontSize.LG,
      textTransform: 'none' as const,
      fontFamily: FontFamily.REGULAR,
      color: theme.disabled,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    tabBarLabelActive: {
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
    },
    tabIndicator: {
      position: 'absolute',
      zIndex: -1,
      top: 2,
      backgroundColor: theme.secondary,
      width: '100%',
      height: '100%',
      borderRadius: Radius.FULL,
    },
    itemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 6,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.secondary,
      borderRadius: Radius.ROUNDED,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 8,
    },
    itemInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    itemName: {
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
    iconButton: {
      padding: 8,
      borderRadius: Radius.FULL,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
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
