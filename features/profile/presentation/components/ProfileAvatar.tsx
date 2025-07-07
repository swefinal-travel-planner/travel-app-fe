import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'

type ProfileAvatarProps = {
  theme: typeof colorPalettes.light
  profilePic: string
  name: string
  email: string
  phone: string
}

const ProfileAvatar = ({ theme, profilePic, name, email, phone }: ProfileAvatarProps) => {
  useEffect(() => {
    // Log the profile picture URL to console for debugging
    console.log(name, email, phone, profilePic)
    console.log('debug profilePic', profilePic)
  }, [])

  return (
    <View style={styles.avatarContainer}>
      <Image source={{ uri: profilePic }} style={[styles.profileImage, { borderColor: theme.primary }]} />
      <View style={[styles.userInfoContainer, { backgroundColor: theme.primary }]}>
        <Text style={{ fontFamily: FontFamily.BOLD, fontSize: FontSize.XXXL, color: 'white', marginBottom: 8 }}>
          {name}
        </Text>
        <Text style={{ fontFamily: FontFamily.REGULAR, color: 'white', marginBottom: 4 }}>{email}</Text>
        <Text style={{ fontFamily: FontFamily.REGULAR, color: 'white' }}>{phone}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    marginBottom: 60,
    position: 'relative',
  },
  profileImage: {
    width: Dimensions.get('window').width - 120,
    height: Dimensions.get('window').width - 120,
    borderRadius: Radius.FULL,
    backgroundColor: '#efefef',
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
    borderRadius: Radius.ROUNDED,
  },
})

export default ProfileAvatar
