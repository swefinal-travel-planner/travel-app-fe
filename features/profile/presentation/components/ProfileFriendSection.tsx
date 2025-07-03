import FriendListModal from '@/app/(tabs)/profile/components/FriendListModal'
import { colorPalettes } from '@/constants/Itheme'
import { Friend } from '@/lib/types/Profile'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-ui-lib'

type ProfileFriendSectionProps = {
  theme: typeof colorPalettes.light
  isError: boolean
  isLoading: boolean
  friendList: Friend[]
  friendListModalVisible: boolean
  setFriendListModalVisible: (visible: boolean) => void
  closeFriendListModal: () => void
}

const ProfileFriendSection = ({
  theme,
  isError,
  isLoading,
  friendList,
  friendListModalVisible,
  setFriendListModalVisible,
  closeFriendListModal,
}: ProfileFriendSectionProps) => (
  <>
    <View style={styles.sectionHeader}>
      <Ionicons name="person-add" size={25} color="black" />
      <Text>Friend</Text>
    </View>
    <Card
      style={[
        styles.sectionContainer,
        {
          backgroundColor: isError || isLoading ? theme.background : 'white',
        },
      ]}
    >
      <TouchableOpacity onPress={() => setFriendListModalVisible(true)} disabled={isLoading || isError}>
        <View style={styles.sectionItemContainer}>
          <View style={styles.sectionItem}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
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
          <Ionicons name="chevron-forward-outline" size={20} color="black" />
        </View>
      </TouchableOpacity>
    </Card>
    <FriendListModal
      theme={theme}
      visible={friendListModalVisible}
      closeModal={closeFriendListModal}
      friendList={friendList}
    />
  </>
)

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  sectionContainer: {
    borderWidth: 2,
    borderRadius: 10,
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
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ProfileFriendSection
