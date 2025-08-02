import Pressable from '@/components/Pressable'
import { useToast } from '@/components/ToastContext'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { getPlaceHolder } from '@/features/trip/utils/AdaptiveImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripId } from '@/hooks/useTripId'
import beApi, { safeBeApiCall } from '@/lib/beApi'
import { SearchResult } from '@/lib/types/UserSearch'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
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

type PendingInvite = {
  username: string
  type: 'sent' | 'received'
  invitationId?: string
}

const TripFriendInviteScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const tripId = useTripId()
  const { showToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [friendIds, setFriendIds] = useState<number[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
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
      setFriendIds(response.data.data?.map((friend: Friend) => friend.id) ?? [])
    } catch (error) {
      console.error('Error loading friends:', error)
    }
  }, [])

  const loadPendingInvites = useCallback(async () => {
    try {
      const response1 = await beApi.get(`/invitation-friends/requested`)
      const response2 = await beApi.get(`/invitation-friends/received`)

      // Extract usernames from sent requests (we sent these)
      const requestedInvites: PendingInvite[] =
        response1.data.data?.map((invite: any) => ({
          username: invite.receiverUsername,
          type: 'sent' as const,
          invitationId: invite.id,
        })) ?? []

      // Extract usernames from received requests (others sent to us)
      const receivedInvites: PendingInvite[] =
        response2.data.data?.map((invite: any) => ({
          username: invite.senderUsername,
          type: 'received' as const,
          invitationId: invite.id,
        })) ?? []

      // Merge both arrays
      const allPendingInvites = [...requestedInvites, ...receivedInvites]

      console.log('Pending invites:', allPendingInvites)

      setPendingInvites(allPendingInvites)
    } catch (error) {
      console.error('Error loading pending invites:', error)
    }
  }, [])

  const searchUsers = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)

      try {
        const searchResponse = await beApi.get(`/users?searchTerm=${searchTerm}`)

        if (searchResponse.data.data) {
          // Handle the new list format returned by the API
          const users = Array.isArray(searchResponse.data.data)
            ? searchResponse.data.data
            : searchResponse.data.data
              ? [searchResponse.data.data]
              : []

          const filteredResults: SearchResult[] = users
            .filter((user: any) => !friendIds.includes(user.id))
            .map((user: any) => ({
              ...user,
              avatar: user.imageURL || user.photoURL || user.avatar || '',
              isInvited: pendingInvites.some((invite) => invite.username === user.username),
              isFriend: false,
            }))

          setSearchResults(filteredResults)
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
    [tripId, friendIds, pendingInvites]
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
    async (username: string, email: string) => {
      setIsLoading(true)
      console.log('Sending invitation to:', username, email)
      try {
        const response = await safeBeApiCall(() =>
          beApi.post(`/invitation-friends`, {
            receiverEmail: email,
          })
        )

        // Server returns 204 No Content for successful invitation
        if (response.status === 204 || response.data) {
          setPendingInvites((prev) => [...prev, { username, type: 'sent' }])
          setSearchResults((prev) =>
            prev.map((user) => (user.username === username ? { ...user, isInvited: true } : user))
          )
          Alert.alert('Success', 'Invitation sent successfully!')
        }
      } catch (error: any) {
        console.error('Invitation error:', error.response?.data?.message)
        const errorMessage = error.response?.data?.message ?? 'Failed to send invitation'

        // If invitation already exists, update UI to reflect this
        if (error.response?.data?.errors?.[0]?.code === 'ADD_FRIEND_INVITATION_ALREADY_EXISTS') {
          // Reload pending invites to get the latest state
          await loadPendingInvites()
          setSearchResults((prev) =>
            prev.map((user) => (user.username === username ? { ...user, isInvited: true } : user))
          )
          showToast({
            type: 'info',
            message: 'A friend invitation already exists with this user',
          })
        } else {
          Alert.alert('Error', errorMessage)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [tripId]
  )

  const cancelInvitation = useCallback(
    async (username: string) => {
      setIsLoading(true)
      try {
        // Find the invitation for this username
        const invitation = pendingInvites.find((invite) => invite.username === username && invite.type === 'sent')

        if (invitation && invitation.invitationId) {
          await beApi.delete(`/invitation-friends/${invitation.invitationId}`)
          setPendingInvites((prev) => prev.filter((invite) => invite.username !== username))
          setSearchResults((prev) =>
            prev.map((user) => (user.username === username ? { ...user, isInvited: false } : user))
          )
          Alert.alert('Success', 'Friend request cancelled successfully!')
        } else {
          // Fallback: get the invitation ID from API
          const response = await beApi.get(`/invitation-friends/requested`)
          const requests = response.data.data || []
          const invitationFromApi = requests.find((req: any) => req.receiverUsername === username)

          if (invitationFromApi) {
            await beApi.delete(`/invitation-friends/${invitationFromApi.id}`)
            setPendingInvites((prev) => prev.filter((invite) => invite.username !== username))
            setSearchResults((prev) =>
              prev.map((user) => (user.username === username ? { ...user, isInvited: false } : user))
            )
            Alert.alert('Success', 'Friend request cancelled successfully!')
          }
        }
      } catch (error: any) {
        console.error('Cancel invitation error:', error.response?.data?.message)
        const errorMessage = error.response?.data?.message ?? 'Failed to cancel invitation'
        Alert.alert('Error', errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [pendingInvites]
  )

  const handleGoBack = () => {
    router.back()
  }

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const pendingInvite = pendingInvites.find((invite) => invite.username === item.username)
    const buttonText = pendingInvite ? (pendingInvite.type === 'sent' ? 'Cancel' : 'Request sent') : 'Add friend'
    const isDisabled = isLoading || pendingInvite?.type === 'received'
    const buttonColor = pendingInvite?.type === 'sent' ? theme.error : theme.primary

    return (
      <View style={styles.resultCard}>
        <View style={styles.userInfo}>
          <Avatar size={50} source={item.avatar ? { uri: item.avatar } : getPlaceHolder(50, 50)} />
          <View style={styles.userDetails}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>
        <Pressable
          title={buttonText}
          disabled={isDisabled}
          style={{
            backgroundColor: buttonColor,
            color: theme.white,
          }}
          onPress={() => {
            if (pendingInvite?.type === 'sent') {
              cancelInvitation(item.username)
            } else if (!pendingInvite) {
              sendInvitation(item.username, item.email)
            }
          }}
          size="small"
        />
      </View>
    )
  }

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
