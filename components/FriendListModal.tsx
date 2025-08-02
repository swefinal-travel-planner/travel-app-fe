import { colorPalettes } from '@/constants/Itheme'
import { getPlaceHolder } from '@/features/trip/utils/AdaptiveImage'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import beApi from '@/lib/beApi'
import { Friend } from '@/lib/types/Profile'
import Ionicons from '@expo/vector-icons/Ionicons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Dialog from 'react-native-dialog'
import { ScrollView } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'
import { Portal } from 'react-native-paper'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Avatar, Button, Card, Text, View } from 'react-native-ui-lib'
import { z } from 'zod'

interface FriendListModalProps {
  visible: boolean
  closeModal: () => void
  friendList: Friend[]
}

const searchSchema = z.object({
  email: z.string({ required_error: 'Email cannot be empty' }).email({ message: 'Invalid email format' }),
})

const FriendListModal = ({ visible, closeModal, friendList }: FriendListModalProps) => {
  const [isSearching, setIsSearching] = useState(false)
  const [visibleFriends, setVisibleFriends] = useState(3)
  const animatedHeight = useSharedValue(225)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [filteredFriendlist, setFilteredFriendlist] = useState<Friend[]>(friendList)

  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  useEffect(() => {
    setIsSearching(false)
    setVisibleFriends(friendList.length > 3 ? 3 : friendList.length)
    setFilteredFriendlist(friendList)
  }, [visible])

  useEffect(() => {
    animatedHeight.value = withSpring(
      visibleFriends === 3 ? 225 : filteredFriendlist.length === 0 ? 75 : filteredFriendlist.length * 75,
      { damping: 100, stiffness: 120 }
    )
  }, [visibleFriends])

  const confirmDeleteFriend = (friend: Friend) => {
    setSelectedFriend(friend)
    setIsDialogVisible(true)
  }

  const handleDeleteFriend = () => {
    if (selectedFriend) {
      const updatedList = friendList.filter((friend) => friend.id !== selectedFriend.id)
      setFilteredFriendlist(updatedList)
      setVisibleFriends(Math.min(visibleFriends, updatedList.length))
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
      const response = await beApi.get(`/users?userEmail=${email}`)
      const data = await response.data
      return data.data
    },
    onError: (err) => console.log('Mutation failed!', err),
  })

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isSearching ? 280 : 0, { damping: 15, stiffness: 120 }),
    opacity: withSpring(isSearching ? 1 : 0),
  }))

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isSearching ? 280 : 370, { damping: 15, stiffness: 120 }),
    opacity: withSpring(isSearching ? 0 : 1),
  }))

  const animatedFriendListStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }))

  return (
    <>
      <Portal>
        <Dialog.Container visible={isDialogVisible}>
          <Dialog.Title>Remove friend</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to remove <Text style={styles.boldText}>{selectedFriend?.name}</Text> from your
            friends list?
          </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={() => setIsDialogVisible(false)} />
          <Dialog.Button label="Delete" onPress={handleDeleteFriend} color="red" />
        </Dialog.Container>
      </Portal>

      <Modal
        isVisible={visible}
        onBackdropPress={closeModal}
        swipeDirection="down"
        onSwipeComplete={closeModal}
        backdropOpacity={0.5}
        style={styles.modal}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
          <View style={styles.container}>
            <View style={styles.handleBarContainer}>
              <View style={styles.handleBar} />
            </View>

            {!isSearching ? (
              <Animated.View style={[styles.searchLabelContainer, labelAnimatedStyle]}>
                <TouchableOpacity onPress={() => setIsSearching(true)}>
                  <View style={styles.addFriendContainer}>
                    <Ionicons name="search" size={25} />
                    <Text text60 marginL-10>
                      Add a new friend
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View style={styles.searchInputContainer}>
                <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
                  <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                    <Ionicons name="search" size={25} color={theme.black} />
                  </TouchableOpacity>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.textInput}
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
                  backgroundColor={theme.white}
                  color={theme.black}
                  labelStyle={styles.boldText}
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
              <View style={styles.errorText}>
                <Text color="red">{errors.email.message}</Text>
              </View>
            )}

            {searchFriendMutation.isPending && (
              <View>
                <Text color="gray">Searching...</Text>
              </View>
            )}

            {searchFriendMutation.isSuccess && searchFriendMutation.data && (
              <View row spread centerV paddingH-20 marginT-10>
                <View row centerV gap-10>
                  <View style={styles.greenBorder}>
                    <Avatar size={40} source={getPlaceHolder(50, 50)} />
                  </View>
                  <Text text60>{searchFriendMutation.data.username}</Text>
                </View>
                <Text text70 style={styles.friendText}>
                  Friend
                </Text>
              </View>
            )}

            {searchFriendMutation.isSuccess && !searchFriendMutation.data && (
              <View>
                <Text color="red" center marginT-10>
                  User does not exist!
                </Text>
              </View>
            )}

            <ScrollView style={styles.scrollContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people" size={25} color={'black'} />
                <Text text60>Your friends</Text>
              </View>

              <Card style={styles.whiteCard}>
                <Animated.View style={[styles.overflowHidden, animatedFriendListStyle]}>
                  {filteredFriendlist.length === 0 ? (
                    <View center style={styles.fullHeight}>
                      <Text text70>Share your request link to add new friend</Text>
                    </View>
                  ) : (
                    filteredFriendlist.slice(0, visibleFriends).map((friend, index) => (
                      <View key={index} row spread paddingV-10 centerV>
                        <View row center gap-10>
                          <View style={styles.greenBorder}>
                            <Avatar size={40} source={getPlaceHolder(50, 50)} />
                          </View>
                          <Text text60>{friend.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => confirmDeleteFriend(friend)}>
                          <Ionicons name="close-outline" size={25} color={theme.black} />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </Animated.View>

                {filteredFriendlist.length > 3 && (
                  <Button
                    label={visibleFriends === 3 ? 'Show more' : 'Show less'}
                    backgroundColor={friendList.length < 4 ? theme.background : theme.primary}
                    labelStyle={styles.boldText}
                    style={styles.toggleButton}
                    disabled={friendList.length < 4}
                    onPress={() => setVisibleFriends(visibleFriends === 3 ? friendList.length : 3)}
                  />
                )}
              </Card>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    boldText: { fontWeight: 'bold' },
    modal: { margin: 0, justifyContent: 'flex-end' },
    keyboardAvoid: { flex: 1 },
    container: {
      height: '95%',
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: 'auto',
    },
    handleBarContainer: {
      marginVertical: 10,
      alignItems: 'center',
    },
    handleBar: {
      width: 40,
      height: 5,
      backgroundColor: 'rgb(173, 171, 171)',
      borderRadius: 10,
      marginBottom: 10,
    },
    addFriendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchLabelContainer: {
      alignSelf: 'flex-start',
      borderRadius: 20,
      padding: 15,
      width: '90%',
      marginLeft: 20,
      backgroundColor: '#f0f0f0',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: 15,
      borderRadius: 60,
    },
    textInput: {
      flexGrow: 1,
      marginLeft: 10,
    },
    errorText: {
      marginVertical: 10,
      alignItems: 'center',
    },
    greenBorder: {
      borderWidth: 3,
      borderColor: 'green',
      borderRadius: 100,
      padding: 3,
    },
    scrollContainer: { padding: 20 },
    sectionHeader: {
      marginTop: 20,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    whiteCard: {
      backgroundColor: 'white',
      padding: 15,
      marginBottom: 25,
      borderRadius: 10,
    },
    cardItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    cardItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    overflowHidden: { overflow: 'hidden' },
    fullHeight: { height: '100%' },
    toggleButton: {
      width: 'auto',
      alignSelf: 'center',
      marginTop: 10,
    },
    linkCircle: {
      backgroundColor: '#32ADE6',
      borderRadius: 100,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    friendText: {
      color: theme.primary,
      fontWeight: 'bold',
    },
  })

export default FriendListModal
