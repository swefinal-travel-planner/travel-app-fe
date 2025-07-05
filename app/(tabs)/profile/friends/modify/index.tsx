import { getPlaceHolder } from '@/components/AdaptiveImage'
import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripId } from '@/hooks/useTripId'
import beApi from '@/lib/beApi'
import { SearchResult } from '@/lib/types/UserSearch'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Avatar } from 'react-native-ui-lib'

type Friend = {
  id: string
  email: string
  username: string
  status: 'pending' | 'accepted' | 'declined'
}

const TripFriendInviteScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const tripId = useTripId()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [pendingInvites, setPendingInvites] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load initial data on component mount
  useEffect(() => {
    loadFriends()
    loadPendingInvites()
  }, [])

  const loadFriends = useCallback(async () => {
    try {
      const response = await beApi.get(`/friends`)
      setFriends(response.data.data || [])
    } catch (error) {
      console.error('Error loading friends:', error)
    }
  }, [])

  const loadPendingInvites = useCallback(async () => {
    try {
      const response1 = await beApi.get(`/invitation-friends/requested`)
      const response2 = await beApi.get(`/invitation-friends/received`)

      // Extract usernames from both responses and merge them
      const requestedUsernames = response1.data.data?.map((invite: any) => invite.receiverUsername) || []
      const receivedUsernames = response2.data.data?.map((invite: any) => invite.senderUsername) || [] // Assuming received invites have senderUsername

      // Merge both arrays and remove duplicates
      const allPendingInvites = [...new Set([...requestedUsernames, ...receivedUsernames])]

      console.log('All pending invites:', allPendingInvites)

      setPendingInvites(allPendingInvites)
    } catch (error) {
      console.error('Error loading pending invites:', error)
    }
  }, [])

  const searchUsers = useCallback(
    async (email: string) => {
      if (!email.trim() || !email.includes('@')) {
        setSearchResults([])
        return
      }

      setIsSearching(true)

      try {
        const token = await SecureStore.getItemAsync('accessToken')

        // Search for users by email
        const searchResponse = await fetch(`${process.env.EXPO_PUBLIC_BE_API_URL}/users?userEmail=${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (searchResponse.ok) {
          const searchData = await searchResponse.json()

          // Filter out existing friends from search results
          const friendIds = friends.map((f: Friend) => f.id)

          if (searchData.data && !friendIds.includes(searchData.data.id)) {
            const result: SearchResult = {
              ...searchData.data,
              isInvited: pendingInvites.includes(searchData.data.username),
              isFriend: false,
            }
            setSearchResults([result])
          } else {
            setSearchResults([])
          }
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [tripId, pendingInvites, friends]
  )

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text)
      if (text.length > 2) {
        searchUsers(text)
      } else {
        setSearchResults([])
      }
    },
    [searchUsers]
  )

  const sendInvitation = useCallback(
    async (username: string, email: string) => {
      setIsLoading(true)
      try {
        const response = await beApi.post(`/invitation-friends`, {
          receiverEmail: email,
        })

        // Server returns 204 No Content for successful invitation
        if (response.status === 204 || response.data) {
          setPendingInvites((prev) => [...prev, username])
          setSearchResults((prev) =>
            prev.map((user) => (user.username === username ? { ...user, isInvited: true } : user))
          )
          Alert.alert('Success', 'Invitation sent successfully!')
        }
      } catch (error: any) {
        console.error('Invitation error:', error.response?.data?.message)
        const errorMessage = error.response?.data?.message || 'Failed to send invitation'
        Alert.alert('Error', errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [tripId]
  )

  const handleGoBack = () => {
    router.back()
  }

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultCard}>
      <View style={styles.userInfo}>
        <Avatar size={50} source={item.avatar ? { uri: item.avatar } : getPlaceHolder(50, 50)} />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
      <Pressable
        title={item.isInvited ? 'Pending invitation' : 'Invite'}
        disabled={item.isInvited || isLoading}
        style={{
          backgroundColor: item.isInvited ? theme.disabled : theme.primary,
          color: theme.white,
        }}
        onPress={() => sendInvitation(item.username, item.email)}
        size="small"
      />
    </View>
  )

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add friends</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.background }]}>
          <Ionicons name="search" size={20} color={theme.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by email address..."
            placeholderTextColor={theme.dimText}
            value={searchQuery}
            onChangeText={handleSearchChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('')
                setSearchResults([])
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={theme.dimText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Status */}
      {isSearching && (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: theme.dimText }]}>Searching...</Text>
        </View>
      )}

      {searchQuery.length > 0 && !isSearching && searchResults.length === 0 && (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: theme.dimText }]}>
            {searchQuery.includes('@') ? 'No users found' : 'Enter a valid email address'}
          </Text>
        </View>
      )}

      {/* Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id.toString()}
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </KeyboardAvoidingView>
  )
}

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
    searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.background,
      borderRadius: Radius.FULL,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      padding: 0,
      borderRadius: Radius.FULL,
      fontFamily: FontFamily.REGULAR,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
    },
    statusContainer: {
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    statusText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      textAlign: 'center',
    },
    resultsList: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    resultCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.secondary,
      borderRadius: Radius.ROUNDED,
      padding: 16,
      marginVertical: 6,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    userDetails: {
      marginLeft: 12,
      flex: 1,
    },
    username: {
      fontSize: FontSize.LG,
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
    },
    email: {
      fontSize: FontSize.MD,
      color: theme.text,
      fontFamily: FontFamily.REGULAR,
    },
    instructionsContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    instructionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    instructionText: {
      fontSize: FontSize.MD,
      marginLeft: 16,
      flex: 1,
      lineHeight: 22,
      fontFamily: FontFamily.REGULAR,
    },
  })

export default TripFriendInviteScreen
