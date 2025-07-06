import ImageActionSheet from '@/components/ImageActionSheet'
import { useToast } from '@/components/ToastContext'
import { EMPTY_STRING } from '@/constants/utilConstants'
import ProfileAvatar from '@/features/profile/presentation/components/ProfileAvatar'
import ProfileDangerSection from '@/features/profile/presentation/components/ProfileDangerSection'
import ProfileFriendSection from '@/features/profile/presentation/components/ProfileFriendSection'
import ProfileSettingsSection from '@/features/profile/presentation/components/ProfileSettingsSection'
import ProfileStats from '@/features/profile/presentation/components/ProfileStats'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi, { safeApiCall } from '@/lib/beApi'
import { Friend } from '@/lib/types/Profile'
import { useThemeStore } from '@/store/themeStore'
import { clearLoginInfo } from '@/utils/clearLoginInfo'
import { uploadImage2Cloud } from '@/utils/uploadImage2Cloud'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import EditProfileModal from '../../../components/EditProfileModal'
import { EMPTY_STRING } from '@/constants/utilConstants'
import { useToast } from '@/components/ToastContext'

export type SettingSection = {
  title: string
  icon:
    | 'camera-outline'
    | 'pencil'
    | 'pencil-outline'
    | 'call-outline'
    | 'mail-outline'
    | 'trash-outline'
    | 'log-out-outline'
    | 'color-palette-outline'
  onPress?: () => void
}

const ProfileScreen = () => {
  const router = useRouter()
  const generalSection: SettingSection[] = [
    {
      title: 'Edit profile picture',
      icon: 'camera-outline',
    },
    { title: 'Edit name', icon: 'pencil-outline' },
    { title: 'Edit phone number', icon: 'call-outline' },
    { title: 'Edit email', icon: 'mail-outline' },
  ]
  const dangerSection: SettingSection[] = [
    { title: 'Change theme', icon: 'color-palette-outline' },
    { title: 'Delete account', icon: 'trash-outline' },
    {
      title: 'Log out',
      icon: 'log-out-outline',
      onPress: () => {
        router.push('/login')
        clearLoginInfo()
      },
    },
  ]

  const theme = useThemeStyle()
  const { setTheme } = useThemeStore()
  //const { setLanguage } = useThemeStore()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false)
  const [friendListModalVisible, setFriendListModalVisible] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('No phone number set')
  const [selectedField, setSelectedField] = useState<string>('Edit name')
  const [profilePic, setProfilePic] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const getUserInfo = async () => {
      const name = await SecureStore.getItemAsync('name')
      const email = await SecureStore.getItemAsync('email')
      const phone = await SecureStore.getItemAsync('phoneNumber')
      const profilePic = await SecureStore.getItemAsync('profilePic')

      setName(name || '')
      setEmail(email || '')
      setPhone(phone || 'No phone number set')
      setProfilePic(profilePic || '')
    }

    getUserInfo()
  }, [])

  const fetchFriends = async () => {
    try {
      const response = await safeApiCall(() => beApi.get('/friends'))

      // If response is null, it means it was a silent error
      if (!response) {
        return []
      }

      const data = response.data
      const friends: Friend[] = (data.data ?? []).map((f: any) => ({
        id: f.id,
        name: f.username,
        avatar: f.imageURL || '',
      }))
      return friends
    } catch (error) {
      console.log('Fetch friends failed:', error)
      throw error
    }
  }

  const {
    data: friendList = [],
    isLoading,
    isError,
  } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: fetchFriends,
  })

  const mapFieldKey = (field: string) => {
    switch (field) {
      case 'Edit name':
        return 'name'
      case 'Edit phone number':
        return 'phoneNumber'
      case 'Edit email':
        return 'email'
      case 'Edit profile picture':
        return 'photoURL'
      default:
        return field
    }
  }

  const handleSave = async (value: string, field: string) => {
    try {
      const key = mapFieldKey(field)

      // Update local state
      if (key === 'name') setName(value)
      else if (key === 'phoneNumber') setPhone(value)
      else if (key === 'email') setEmail(value)
      else if (key === 'photoURL') setProfilePic(value)
      const response = await safeApiCall(() =>
        beApi.patch('/users/me', {
          [key]: value,
        })
      )

      // If response is null, it means it was a silent error
      if (!response) {
        return
      }
      if (response.status !== 204) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      showToast({
        type: 'success',
        message: `${field} updated successfully!`,
        position: 'bottom',
      })
      setModalVisible(false)
    } catch (error) {
      console.log('Update profile failed:', error)
      throw error
    }
  }

  const openModal = (field: string) => {
    setSelectedField(field)
    setModalVisible(true)
  }

  const closeFriendListModal = () => {
    setFriendListModalVisible(false)
  }

  return (
    <PaperProvider>
      <GestureHandlerRootView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Avatar and Personal Information */}
          <ProfileAvatar theme={theme} profilePic={profilePic} name={name} email={email} phone={phone} />

          {/* Statistics */}
          <ProfileStats onGoToTrips={() => router.push('/my-trips')} />

          {/* Friendlist */}
          <ProfileFriendSection isError={isError} isLoading={isLoading} friendList={friendList} />

          {/* Personal Information */}
          <ProfileSettingsSection
            generalSection={generalSection}
            openModal={openModal}
            setShowActionSheet={setShowActionSheet}
          />

          {/* Danger Zone */}
          <ProfileDangerSection
            dangerSection={dangerSection}
            isDarkTheme={isDarkTheme}
            setIsDarkTheme={setIsDarkTheme}
            setTheme={setTheme}
          />
        </ScrollView>

        {/* Popup modal */}
        <EditProfileModal
          value={selectedField === 'Edit name' ? name : selectedField === 'Edit phone number' ? phone : email}
          visible={modalVisible}
          field={selectedField}
          onSave={handleSave}
          closeModal={() => setModalVisible(false)}
        />

        {/* Choose profile picture */}
        <ImageActionSheet
          visible={showActionSheet}
          onDismiss={() => setShowActionSheet(false)}
          onImagePicked={async (uri) => {
            handleSave((await uploadImage2Cloud(uri, 'avatars')) ?? EMPTY_STRING, 'Edit profile picture')
          }}
          aspect={[1, 1]}
          allowsEditing={true}
        />
      </GestureHandlerRootView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingTop: 30,
    paddingHorizontal: 22,
  },
})

export default ProfileScreen
