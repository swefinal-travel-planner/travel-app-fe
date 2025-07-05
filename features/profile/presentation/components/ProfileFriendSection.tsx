import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Friend } from '@/lib/types/Profile'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-ui-lib'

type ProfileFriendSectionProps = {
  isError: boolean
  isLoading: boolean
  friendList: Friend[]
}

const ProfileFriendSection = ({ isError, isLoading, friendList }: ProfileFriendSectionProps) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.header}>Friends</Text>
      </View>
      <View style={[styles.sectionContainer]}>
        <TouchableOpacity onPress={() => router.push('/profile/friends')} disabled={isLoading || isError}>
          <View style={styles.sectionItemContainer}>
            <View style={styles.sectionItem}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                <Ionicons name="people-outline" size={20} color="white" />
              </View>
              {isLoading ? (
                <Text style={styles.text}>Loading friends...</Text>
              ) : isError ? (
                <Text style={[styles.text, { color: isError ? theme.error : theme.text }]}>Error loading friends</Text>
              ) : (
                <Text style={styles.text}>
                  {friendList.length}
                  {friendList.length <= 1 ? ' friend' : ' friends'}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      gap: 5,
    },
    sectionContainer: {
      borderRadius: Radius.ROUNDED,
      padding: 15,
      marginBottom: 25,
      backgroundColor: theme.background,
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
    header: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    text: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
    },
  })

export default ProfileFriendSection
