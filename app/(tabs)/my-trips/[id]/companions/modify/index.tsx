import Pressable from '@/components/Pressable'
import { useToast } from '@/components/ToastContext'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { getPlaceHolder } from '@/features/trip/utils/AdaptiveImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripId } from '@/hooks/useTripId'
import beApi, { safeBeApiCall } from '@/lib/beApi'
import { Friend } from '@/lib/types/Profile'
import { SearchResult } from '@/lib/types/UserSearch'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Avatar } from 'react-native-ui-lib'

type TripCompanion = {
  user_id: string
  email: string
  username: string
  status: 'pending' | 'accepted' | 'declined'
}

type FriendWithInviteStatus = Friend & {
  isInvited?: boolean
  isCompanion?: boolean
}

const TripCompanionInviteScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const tripId = useTripId()

  const { showToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [companions, setCompanions] = useState<TripCompanion[]>([])
  const [pendingInvites, setPendingInvites] = useState<number[]>([])
  const [friends, setFriends] = useState<FriendWithInviteStatus[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadCompanions = useCallback(async () => {
    try {
      const response = await safeBeApiCall(() => beApi.get(`/trips/${tripId}/members`))

      // If response is null, it means it was a silent error
      if (!response) {
        setCompanions([])
        return
      }

      setCompanions(response.data.data || [])
    } catch (error) {
      console.error('Error loading companions:', error)
      setCompanions([])
    }
  }, [tripId])

  const loadPendingInvites = useCallback(async () => {
    try {
      const response = await safeBeApiCall(() => beApi.get(`/trips/${tripId}/pending-invitations`))

      // If response is null, it means it was a silent error
      if (!response) {
        setPendingInvites([])
        return
      }

      setPendingInvites(response.data.data?.map((invite: any) => invite.receiverId) || [])
    } catch (error) {
      console.error('Error loading pending invites:', error)
      setPendingInvites([])
    }
  }, [tripId])

  const loadFriends = useCallback(async () => {
    try {
      const response = await safeBeApiCall(() => beApi.get('/friends'))

      // If response is null, it means it was a silent error
      if (!response) {
        setFriends([])
        return
      }

      // Transform friends data to match Friend interface
      const friendsData = response.data.data || []
      const transformedFriends: FriendWithInviteStatus[] = friendsData.map((friend: any) => ({
        id: friend.id,
        name: friend.username || friend.name,
        avatar: friend.imageURL || friend.avatar || '',
        isInvited: pendingInvites.includes(friend.id),
        isCompanion: companions.some((comp) => comp.user_id === friend.id.toString()),
      }))
      setFriends(transformedFriends)
    } catch (error) {
      console.error('Error loading friends:', error)
      setFriends([])
    }
  }, [pendingInvites, companions])

  // Load initial data on component mount
  useEffect(() => {
    loadCompanions()
    loadPendingInvites()
  }, [tripId])

  // Load friends when companions or pending invites change
  useEffect(() => {
    loadFriends()
  }, [loadFriends])

  const searchUsers = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)

      try {
        const searchResponse = await safeBeApiCall(() => beApi.get(`/users?searchTerm=${searchTerm}`))

        // If response is null, it means it was a silent error
        if (!searchResponse) {
          setSearchResults([])
          return
        }

        if (searchResponse.status === 200) {
          const searchData = searchResponse.data

          // Filter out existing companions from search results
          const companionIds = companions.map((comp: TripCompanion) => comp.user_id)

          // Handle the new list format returned by the API
          const users = Array.isArray(searchData.data) ? searchData.data : searchData.data ? [searchData.data] : []

          const filteredResults: SearchResult[] = users
            .filter((user: any) => !companionIds.includes(user.id.toString()))
            .map((user: any) => ({
              ...user,
              avatar: user.imageURL || user.photoURL || user.avatar || '',
              isInvited: pendingInvites.includes(user.id),
              isCompanion: false,
            }))

          setSearchResults(filteredResults)
          console.log('Search results:', filteredResults)
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
    [tripId, pendingInvites, companions]
  )

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text)
      if (text.length > 1) {
        searchUsers(text)
      } else {
        setSearchResults([])
      }
    },
    [searchUsers]
  )

  const sendInvitation = useCallback(
    async (userId: number) => {
      setIsLoading(true)
      try {
        const response = await safeBeApiCall(() =>
          beApi.post(`/invitation-trips`, {
            receiverId: userId,
            tripId: tripId,
          })
        )

        // If response is null, it means it was a silent error
        if (!response) {
          showToast({
            type: 'error',
            message: 'Failed to send invitation. Please try again.',
            position: 'bottom',
          })
          return
        }

        // Server returns 204 No Content for successful invitation
        if (response.status === 204 || response.data) {
          setPendingInvites((prev) => [...prev, userId])
          setSearchResults((prev) => prev.map((user) => (user.id === userId ? { ...user, isInvited: true } : user)))
          setFriends((prev) => prev.map((friend) => (friend.id === userId ? { ...friend, isInvited: true } : friend)))
          showToast({
            type: 'success',
            message: 'Invitation sent successfully!',
            position: 'bottom',
          })
        }
      } catch (error: any) {
        console.error('Invitation error:', error.response?.data?.message)
        const errorMessage = error.response?.data?.message || 'Failed to send invitation'
        showToast({
          type: 'error',
          message: errorMessage,
          position: 'bottom',
        })
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
        title={item.isInvited ? 'Withdraw' : 'Invite'}
        disabled={isLoading}
        style={{
          backgroundColor: item.isInvited ? theme.error : theme.primary,
          color: theme.white,
        }}
        onPress={() =>
          item.isInvited ? console.log('Withdraw invitation for user:', item.id) : sendInvitation(item.id)
        }
        size="small"
      />
    </View>
  )

  const renderFriendResult = ({ item }: { item: FriendWithInviteStatus }) => (
    <View style={styles.resultCard}>
      <View style={styles.userInfo}>
        <Avatar size={50} source={item.avatar ? { uri: item.avatar } : getPlaceHolder(50, 50)} />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{item.name}</Text>
          <Text style={styles.email}>Friend</Text>
        </View>
      </View>
      {item.isCompanion ? (
        <View style={[styles.statusBadge, { backgroundColor: theme.green }]}>
          <Text style={styles.statusText}>Companion</Text>
        </View>
      ) : (
        <Pressable
          title={item.isInvited ? 'Withdraw' : 'Invite'}
          disabled={isLoading}
          style={{
            backgroundColor: item.isInvited ? theme.error : theme.primary,
            color: theme.white,
          }}
          onPress={() =>
            item.isInvited ? console.log('Withdraw invitation for friend:', item.id) : sendInvitation(item.id)
          }
          size="small"
        />
      )}
    </View>
  )

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Invite companions</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.background }]}>
          <Ionicons name="search" size={20} color={theme.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by username or email..."
            placeholderTextColor={theme.dimText}
            value={searchQuery}
            onChangeText={handleSearchChange}
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
          <Text style={[styles.statusText, { color: theme.dimText }]}>No users found</Text>
        </View>
      )}

      {/* Search Results */}
      <ScrollView
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* Search Results Section */}
        {searchResults.map((item) => (
          <View key={item.id.toString()}>{renderSearchResult({ item })}</View>
        ))}

        {/* Friends Section */}
        {friends.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="people-outline" size={24} color={theme.text} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Your friends</Text>
            </View>
            {friends.map((item) => (
              <View key={`friend-${item.id}`}>{renderFriendResult({ item })}</View>
            ))}
          </>
        )}
      </ScrollView>
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
      paddingBottom: 16,
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
      fontSize: 14,
      textAlign: 'center',
      fontFamily: FontFamily.REGULAR,
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
    statusBadge: {
      backgroundColor: theme.green,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      marginLeft: 4,
    },
  })

export default TripCompanionInviteScreen
