import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Colors,
  Card,
  Avatar,
  Button,
  Toast,
} from 'react-native-ui-lib'
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import Dialog from 'react-native-dialog'
import Modal from 'react-native-modal'
import { Share } from 'react-native'
import { Portal } from 'react-native-paper'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Friend } from '@/lib/types/Profile'

interface FriendListModalProps {
  visible: boolean
  closeModal: () => void
  friendList: Friend[]
  //onUpdateFriendList: (updatedList: Friend[]) => void;
}

const url = process.env.EXPO_PUBLIC_API_URL

// schema for search friend
const searchSchema = z.object({
  email: z
    .string({ required_error: 'Email cannot be empty' })
    .email({ message: 'Invalid email format' }),
})

const FriendListModal: React.FC<FriendListModalProps> = ({
  visible,
  closeModal,
  friendList,
  //onUpdateFriendList,
}) => {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [visibleFriends, setVisibleFriends] = useState<number>(3)
  const animatedHeight = useSharedValue(225)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false)
  const [filteredFriendlist, setFilteredFriendlist] =
    useState<Friend[]>(friendList)

  const shareText = async () => {
    try {
      const message = 'Test sharing invitation from Trip 🚀'
      const url = 'https://example.com'

      const shareOptions = Platform.select({
        ios: {
          message: `${message} ${url}`, // iOS cần gộp message + URL
        },
        android: {
          message,
          url, // Android hỗ trợ tách riêng
        },
      })

      if (shareOptions) {
        await Share.share(shareOptions)
      } else {
        console.error('No valid share options available')
      }
    } catch (error) {
      console.log('Error sharing:', error)
    }
  }

  useEffect(() => {
    setIsSearching(false)
    setVisibleFriends(friendList.length > 3 ? 3 : friendList.length)
    setFilteredFriendlist(friendList)
  }, [visible])

  useEffect(() => {
    animatedHeight.value = withSpring(
      visibleFriends === 3
        ? 225
        : filteredFriendlist.length === 0
          ? 75
          : filteredFriendlist.length * 75,
      {
        damping: 100,
        stiffness: 120,
      }
    )
  }, [visibleFriends])

  const confirmDeleteFriend = (friend: Friend) => {
    setSelectedFriend(friend)
    setIsDialogVisible(true)
  }

  const handleDeleteFriend = () => {
    if (selectedFriend) {
      const updatedList = friendList.filter(
        (friend) => friend.id !== selectedFriend.id
      )

      setFilteredFriendlist(updatedList)
      //onUpdateFriendList(updatedList);

      const newVisibleFriends = Math.min(visibleFriends, updatedList.length)
      setVisibleFriends(newVisibleFriends)

      setIsDialogVisible(false)
      setSelectedFriend(null)
    }
  }

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
  })

  const onSubmit = (data: { email: string }) => {
    searchFriendMutation.mutate(data.email)
  }

  const searchFriendMutation = useMutation({
    mutationFn: async (email: string) => {
      try {
        const token = await SecureStore.getItemAsync('accessToken')

        const response = await fetch(`${url}/users?userEmail=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorBody = await response.json()
          throw new Error(errorBody.message || `HTTP Error: ${response.status}`)
        }

        const data = await response.json()
        return data.data
      } catch (err) {
        console.error('Error in mutationFn:', err)
        throw err
      }
    },
    onError: (err) => {
      console.log('Mutation failed!', err)
    },
  })

  const addFriendMutation = useMutation({
    mutationFn: async () => {
      try {
        const emailValue = watch('email')
        const token = await SecureStore.getItemAsync('accessToken')

        const response = await fetch(`${url}/invitation-friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverEmail: emailValue,
          }),
          method: 'POST',
        })

        if (!response.ok) {
          const errorBody = await response.json()
          throw new Error(errorBody.message || `HTTP Error: ${response.status}`)
        }
      } catch (err) {
        console.error('Error in mutationFn:', err)
        throw err
      }
    },
    onError: (err) => {
      console.log('Mutation failed!', err)
    },
    onSuccess: () => {
      Toast.show('Friend added successfully', {
        position: 'bottom',
        duration: 2000,
      })
      setIsSearching(false)
      searchFriendMutation.reset()
      reset()
    },
  })

  // Animation mở rộng input khi search
  const inputAnimatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isSearching ? 280 : 0, { damping: 15, stiffness: 120 }),
    opacity: withSpring(isSearching ? 1 : 0),
  }))

  // Animation mở rộng label khi đóng search
  const labelAnimatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isSearching ? 280 : 370, { damping: 15, stiffness: 120 }),
    opacity: withSpring(isSearching ? 0 : 1),
  }))

  // Animation mở rộng/thu gọn FriendList
  const animatedFriendListStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }))

  return (
    <>
      {/* Confirm Delete Friend Dialog */}
      <Portal>
        <Dialog.Container visible={isDialogVisible}>
          <Dialog.Title>Remove Friend</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to remove{' '}
            <Text style={{ fontWeight: 'bold' }}>{selectedFriend?.name}</Text>{' '}
            from your friends list?
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => setIsDialogVisible(false)}
          />
          <Dialog.Button
            label="Delete"
            onPress={handleDeleteFriend}
            color="red"
          />
        </Dialog.Container>
      </Portal>

      <Modal
        isVisible={visible}
        onBackdropPress={closeModal}
        swipeDirection="down"
        onSwipeComplete={closeModal}
        backdropOpacity={0.5}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View
            style={[
              {
                height: '95%',
                backgroundColor: Colors.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                marginTop: 'auto',
              },
            ]}
          >
            <View centerH marginV-10>
              <View
                style={{
                  width: 40,
                  height: 5,
                  backgroundColor: Colors.grey50,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              />
            </View>

            {/* Search input field */}
            {!isSearching ? (
              <Animated.View
                style={[
                  {
                    alignSelf: 'flex-start',
                    borderRadius: 20,
                    padding: 15,
                    width: '90%',
                    marginLeft: 20,
                    backgroundColor: '#f0f0f0',
                  },
                  labelAnimatedStyle,
                ]}
              >
                <TouchableOpacity onPress={() => setIsSearching(true)}>
                  <View row centerH>
                    <Ionicons name="search" size={25} />
                    <Text text60 marginL-10>
                      Add a new friend
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View row centerV spread paddingH-20>
                <Animated.View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f0f0f0',
                      padding: 15,
                      borderRadius: 60,
                    },
                    inputAnimatedStyle,
                  ]}
                >
                  <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                    <Ionicons name="search" size={25} color="black" />
                  </TouchableOpacity>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={{ flexGrow: 1, marginLeft: 10 }}
                        keyboardType="default"
                        placeholder="Add a new friend"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </Animated.View>

                <Button
                  label="Cancel"
                  backgroundColor={Colors.white}
                  color="black"
                  labelStyle={{ fontWeight: 'bold' }}
                  br50
                  onPress={() => {
                    setIsSearching(false)
                    searchFriendMutation.reset()
                    reset()
                  }}
                />
              </View>
            )}

            {errors.email && (
              <View paddingH-25>
                <Text color="red">{errors.email.message}</Text>
              </View>
            )}

            {searchFriendMutation.isPending && (
              <View marginV-10 center>
                <Text color="gray">Searching...</Text>
              </View>
            )}

            {/* handle thêm trường hợp user không tồn tại */}
            {searchFriendMutation.isSuccess && searchFriendMutation.data && (
              <View row spread centerV paddingH-20 marginT-10>
                <View row centerV gap-10>
                  <View
                    style={{
                      borderWidth: 3,
                      borderColor: 'green',
                      borderRadius: 100,
                      padding: 3,
                    }}
                  >
                    <Avatar
                      size={40}
                      source={require('@/assets/images/pig.jpg')}
                    />
                  </View>
                  <Text text60>{searchFriendMutation.data.username}</Text>
                </View>
                <Button
                  label="Add"
                  backgroundColor="#3F6453"
                  onPress={() => {
                    addFriendMutation.mutate()
                  }}
                />
              </View>
            )}

            {searchFriendMutation.isSuccess && !searchFriendMutation.data && (
              <View>
                <Text color="red" center marginT-10>
                  User does not exist!
                </Text>
              </View>
            )}

            <ScrollView style={{ padding: 20 }}>
              {/* Friendlist */}
              <View row centerV gap-5 marginT-20 marginB-10>
                <Ionicons name="people" size={25} color="black" />
                <Text text60>Your friends</Text>
              </View>
              <Card
                padding-15
                marginB-25
                borderRadius={10}
                style={{ backgroundColor: Colors.white }}
              >
                <Animated.View
                  style={[{ overflow: 'hidden' }, animatedFriendListStyle]}
                >
                  {filteredFriendlist.length === 0 ? (
                    <View center style={{ height: '100%' }}>
                      <Text text70>
                        Share your request link to add new friend
                      </Text>
                    </View>
                  ) : (
                    filteredFriendlist
                      .slice(0, visibleFriends)
                      .map((friend, index) => (
                        <View key={index} row spread paddingV-10 centerV>
                          <View row center gap-10>
                            <View
                              style={{
                                borderWidth: 3,
                                borderColor: 'green',
                                borderRadius: 100,
                                padding: 3,
                              }}
                            >
                              {/* <Avatar size={40} source={friend.avatar} /> */}
                              <Avatar
                                size={40}
                                source={require('@/assets/images/pig.jpg')}
                              />
                            </View>
                            <Text text60>{friend.name}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => confirmDeleteFriend(friend)}
                          >
                            <Ionicons
                              name="close-outline"
                              size={25}
                              color="black"
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                  )}
                </Animated.View>
                {filteredFriendlist.length > 3 && (
                  <Button
                    label={visibleFriends === 3 ? 'Show more' : 'Show less'}
                    marginT-10
                    backgroundColor={
                      friendList.length < 4 ? Colors.grey5 : '#3F6453'
                    }
                    labelStyle={{ fontWeight: 'bold' }}
                    style={{ width: 'auto', alignSelf: 'center' }}
                    disabled={friendList.length < 4}
                    onPress={() =>
                      setVisibleFriends(
                        visibleFriends === 3 ? friendList.length : 3
                      )
                    }
                  />
                )}
              </Card>

              {/* Share request link */}
              <View row centerV gap-5 marginT-20 marginB-10>
                <Ionicons name="paper-plane" size={25} color="black" />
                <Text text60>Share your request link</Text>
              </View>
              <Card
                padding-15
                marginB-25
                borderRadius={10}
                style={{ backgroundColor: Colors.white }}
              >
                <TouchableOpacity onPress={shareText}>
                  <View row spread centerV paddingV-10>
                    <View row center gap-10>
                      <View
                        style={{ backgroundColor: '#32ADE6' }}
                        br100
                        width={50}
                        height={50}
                        center
                      >
                        <Ionicons name="link" size={30} color="white" />
                      </View>
                      <Text>Share your request link</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={20}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </Card>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}

export default FriendListModal
