import ImageActionSheet from '@/components/ImageActionSheet'
import ProfileAvatar from '@/features/profile/presentation/components/ProfileAvatar'
import ProfileDangerSection from '@/features/profile/presentation/components/ProfileDangerSection'
import ProfileFriendSection from '@/features/profile/presentation/components/ProfileFriendSection'
import ProfileSettingsSection from '@/features/profile/presentation/components/ProfileSettingsSection'
import ProfileStats from '@/features/profile/presentation/components/ProfileStats'
import { Friend } from '@/lib/types/Profile'
import { useThemeStore } from '@/store/themeStore'
import { clearLoginInfo } from '@/utils/clearLoginInfo'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import EditProfileModal from './components/EditProfileModal'
import FriendListModal from './components/FriendListModal'
import { useThemeStyle } from '@/hooks/useThemeStyle'

export type SettingSection = {
  title: string
  icon:
    | 'camera-outline'
    | 'pencil'
    | 'call-outline'
    | 'mail-outline'
    | 'trash-outline'
    | 'log-out-outline'
    | 'color-palette-outline'
  onPress?: () => void
}

const url = process.env.EXPO_PUBLIC_API_URL

const ProfileScreen = () => {
  const router = useRouter()
  const generalSection: SettingSection[] = [
    {
      title: 'Edit profile picture',
      icon: 'camera-outline',
    },
    { title: 'Edit name', icon: 'pencil' },
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
  const [phone, setPhone] = useState<string>('<phone_number>')
  const [selectedField, setSelectedField] = useState<string>('Edit name')
  const [profilePic, setProfilePic] = useState(require('@/assets/images/alligator.jpg'))
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    const getUserInfo = async () => {
      const name = await SecureStore.getItemAsync('name')
      const email = await SecureStore.getItemAsync('email')
      if (name && email) {
        setName(name)
        setEmail(email)
      }
    }
    getUserInfo()
  }, [])

  const fetchFriends = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      const response = await fetch(`${url}/friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
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

  const handleSave = (value: string, field: string) => {
    field.includes('name') ? setName(value) : field.includes('phone') ? setPhone(value) : setEmail(value)
    closeModal()
  }

  const openModal = (field: string) => {
    setSelectedField(field)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
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
          <ProfileStats theme={theme} onGoToTrips={() => router.push('/my-trips')} />

          {/* Friendlist */}
          <ProfileFriendSection
            theme={theme}
            isError={isError}
            isLoading={isLoading}
            friendList={friendList}
            friendListModalVisible={friendListModalVisible}
            setFriendListModalVisible={setFriendListModalVisible}
            closeFriendListModal={closeFriendListModal}
          />

          {/* Personal Information */}
          <ProfileSettingsSection
            theme={theme}
            generalSection={generalSection}
            openModal={openModal}
            setShowActionSheet={setShowActionSheet}
          />

          {/* Danger Zone */}
          <ProfileDangerSection
            theme={theme}
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
          closeModal={closeModal}
        />

        {/* Friend list modal */}
        <FriendListModal
          visible={friendListModalVisible}
          closeModal={closeFriendListModal}
          friendList={friendList}
          //onUpdateFriendList={setFriendList}
        />

        <ImageActionSheet
          visible={showActionSheet}
          onDismiss={() => setShowActionSheet(false)}
          onImagePicked={(uri) => {
            setProfilePic({ uri })
          }}
        />
      </GestureHandlerRootView>
      <StatusBar style="dark" />
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
