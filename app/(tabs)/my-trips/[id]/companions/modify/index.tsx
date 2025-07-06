import { getPlaceHolder } from '@/components/AdaptiveImage'
import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripId } from '@/hooks/useTripId'
import beApi, { safeApiCall } from '@/lib/beApi'
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

type TripCompanion = {
  user_id: string
  email: string
  username: string
  status: 'pending' | 'accepted' | 'declined'
}

const TripCompanionInviteScreen = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const tripId = useTripId()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [companions, setCompanions] = useState<TripCompanion[]>([])
  const [pendingInvites, setPendingInvites] = useState<number[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load initial data on component mount
  useEffect(() => {
    loadCompanions()
    loadPendingInvites()
  }, [tripId])

  const loadCompanions = useCallback(async () => {
    try {
      const response = await safeApiCall(() => beApi.get(`/trips/${tripId}/members`))

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
      const response = await safeApiCall(() => beApi.get(`/trips/${tripId}/pending-invitations`))

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

  const searchUsers = useCallback(
    async (email: string) => {
      if (!email.trim() || !email.includes('@')) {
        setSearchResults([])
        return
      }

      setIsSearching(true)

      try {
        const searchResponse = await safeApiCall(() => beApi.get(`/users?userEmail=${email}`))

        // If response is null, it means it was a silent error
        if (!searchResponse) {
          setSearchResults([])
          return
        }

        if (searchResponse.status === 200) {
          const searchData = searchResponse.data

          // Filter out existing companions from search results
          const companionIds = companions.map((comp: TripCompanion) => comp.user_id)

          if (searchData.data && !companionIds.includes(searchData.data.id)) {
            const result: SearchResult = {
              ...searchData.data,
              isInvited: pendingInvites.includes(searchData.data.id),
              isCompanion: false,
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
    [tripId, pendingInvites, companions]
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
    async (userId: number) => {
      setIsLoading(true)
      try {
        const response = await safeApiCall(() =>
          beApi.post(`/invitation-trips`, {
            receiverId: userId,
            tripId: tripId,
          })
        )

        // If response is null, it means it was a silent error
        if (!response) {
          Alert.alert('Error', 'Failed to send invitation. Please try again.')
          return
        }

        // Server returns 204 No Content for successful invitation
        if (response.status === 204 || response.data) {
          setPendingInvites((prev) => [...prev, userId])
          setSearchResults((prev) => prev.map((user) => (user.id === userId ? { ...user, isInvited: true } : user)))
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
        title={item.isInvited ? 'Invited' : 'Invite'}
        disabled={item.isInvited || isLoading}
        style={{
          backgroundColor: item.isInvited ? theme.disabled : theme.primary,
          color: theme.white,
        }}
        onPress={() => sendInvitation(item.id)}
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Invite companions</Text>
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

      {/* Instructions */}
      {searchQuery.length === 0 && (
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionItem}>
            <Ionicons name="search" size={24} color={theme.text} />
            <Text style={[styles.instructionText, { color: theme.text }]}>
              Search for friends by their email address
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="person-add" size={24} color={theme.text} />
            <Text style={[styles.instructionText, { color: theme.text }]}>Send invitation to join your trip</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="people" size={24} color={theme.text} />
            <Text style={[styles.instructionText, { color: theme.text }]}>Collaborate and plan together</Text>
          </View>
        </View>
      )}
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
      fontSize: 14,
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

export default TripCompanionInviteScreen
