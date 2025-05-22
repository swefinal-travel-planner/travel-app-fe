import Ionicons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import { ActionSheet, Button, Card, Image, Text } from 'react-native-ui-lib'
import EditProfileModal from './components/EditProfileModal'
import FriendListModal from './components/FriendListModal'
//import { useThemeStore } from "@/store/useThemeStore";
import { Friend } from '@/lib/types/Profile'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

interface SettingSection {
  title: string
  icon:
    | 'camera-outline'
    | 'pencil'
    | 'call-outline'
    | 'mail-outline'
    | 'trash-outline'
    | 'log-out-outline'
    | 'color-palette-outline'
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
    { title: 'Log out', icon: 'log-out-outline' },
  ]
  //const { setTheme } = useThemeStore()
  //const { setLanguage } = useThemeStore()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false)
  const [friendListModalVisible, setFriendListModalVisible] =
    useState<boolean>(false)
  const [name, setName] = useState<string>('Đặng Nhật Beo')
  const [email, setEmail] = useState<string>('csb@gmail.com')
  const [phone, setPhone] = useState<string>('4060001290')
  const [selectedField, setSelectedField] = useState<string>('Edit name')
  const [profilePic, setProfilePic] = useState(
    require('@/assets/images/alligator.jpg')
  )

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

  // Mở album ảnh
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri })
    }
  }

  // Mở camera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri })
    }
  }

  const openActionSheet = () => {
    setShowActionSheet(true)
  }

  const handleSave = (value: string, field: string) => {
    field.includes('name')
      ? setName(value)
      : field.includes('phone')
        ? setPhone(value)
        : setEmail(value)
    closeModal()
  }

  const openModal = (field: string) => {
    setSelectedField(field)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const openFriendListModal = () => {
    setFriendListModalVisible(true)
  }

  const closeFriendListModal = () => {
    setFriendListModalVisible(false)
  }

  return (
    <PaperProvider>
      <GestureHandlerRootView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Avatar and Personal Information */}
          <View style={styles.avatarContainer}>
            <Image source={profilePic} style={styles.profileImage} />
            <View style={styles.userInfoContainer}>
              <Text text50 marginT-10 color="white">
                {name}
              </Text>
              <Text text70 color="white">
                {email}
              </Text>
              <Text text70 color="white">
                {phone}
              </Text>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statsItem}>
              <Text text70>Number of Trips</Text>
              <Text text50BO>70</Text>
              <Button
                label="Go to My trips"
                backgroundColor="#3F6453"
                onPress={() => router.push('/my-trips')}
              />
            </View>
            <View style={styles.statsItem}>
              <Text text70>Completed Trips</Text>
              <Text text50BO>50</Text>
              <Button label="View Trip history" backgroundColor="#3F6453" />
            </View>
          </View>

          {/* Friendlist */}
          <View style={styles.sectionHeader}>
            <Ionicons name="person-add" size={25} color="black" />
            <Text>Friend</Text>
          </View>
          <Card
            style={[
              styles.sectionContainer,
              {
                backgroundColor: isError || isLoading ? '#E8ECF0' : 'white',
              },
            ]}
          >
            <TouchableOpacity
              onPress={openFriendListModal}
              disabled={isLoading || isError}
            >
              <View style={styles.sectionItemContainer}>
                <View style={styles.sectionItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="people" size={20} color="white" />
                  </View>
                  {isLoading ? (
                    <Text>Loading friends...</Text>
                  ) : isError ? (
                    <Text>Error loading friends</Text>
                  ) : (
                    <Text>{friendList.length} Friends</Text>
                  )}
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          </Card>

          {/* Personal Information */}
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={25} color="black" />
            <Text text70>General</Text>
          </View>
          <Card style={styles.sectionContainer}>
            {generalSection.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={
                  item.title.includes('picture')
                    ? openActionSheet
                    : () => openModal(item.title)
                }
              >
                <View style={styles.sectionItemContainer}>
                  <View style={styles.sectionItem}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon} size={20} color="white" />
                    </View>
                    <Text>{item.title}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </Card>

          {/* Danger Zone */}
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle-outline" size={25} color="red" />
            <Text text70 color="red">
              Danger Zone
            </Text>
          </View>
          <Card style={styles.sectionContainer}>
            {dangerSection.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  //setTheme('dark')
                  //setLanguage('vi')
                }}
              >
                <View style={styles.sectionItemContainer}>
                  <View style={styles.sectionItem}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon} size={20} color="white" />
                    </View>
                    <Text>{item.title}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        </ScrollView>

        {/* Popup modal */}
        <EditProfileModal
          value={
            selectedField === 'Edit name'
              ? name
              : selectedField === 'Edit phone number'
                ? phone
                : email
          }
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

        <ActionSheet
          visible={showActionSheet}
          onDismiss={() => setShowActionSheet(false)}
          useNativeIOS={Platform.OS === 'ios' ? true : false}
          options={[
            { label: 'Take Photo', onPress: takePhoto },
            { label: 'Choose from Library', onPress: pickImage },
            {
              label: 'Cancel',
              onPress: () => setShowActionSheet(false),
              cancel: true,
            },
          ]}
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
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  profileImage: {
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').width - 50,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#3F6453',
    resizeMode: 'cover',
  },
  userInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: 40 }],
    backgroundColor: '#3F6453',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  statsContainer: {
    borderWidth: 2,
    borderColor: '#E5DACB',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 25,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  statsItem: {
    borderRightWidth: 2,
    borderRightColor: '#E5DACB',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  sectionContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#E5DACB',
    padding: 15,
    marginBottom: 25,
  },
  sectionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    backgroundColor: '#3F6453',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ProfileScreen
