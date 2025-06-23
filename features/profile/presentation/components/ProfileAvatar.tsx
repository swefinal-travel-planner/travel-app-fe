import { colorPalettes } from '@/constants/Itheme'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Image, Text } from 'react-native-ui-lib'

type ProfileAvatarProps = {
  theme: typeof colorPalettes.light
  profilePic: any // Replace 'any' with the appropriate type for your image source
  name: string
  email: string
  phone: string
}

const ProfileAvatar = ({ theme, profilePic, name, email, phone }: ProfileAvatarProps) => (
  <View style={styles.avatarContainer}>
    <Image source={profilePic} style={[styles.profileImage, { borderColor: theme.primary }]} />
    <View style={[styles.userInfoContainer, { backgroundColor: theme.primary }]}>
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
)

const styles = StyleSheet.create({
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
    resizeMode: 'cover',
  },
  userInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: 40 }],
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
})

export default ProfileAvatar
