import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Colors, Drawer } from 'react-native-ui-lib'

import { useThemeStyle } from '@/hooks/useThemeStyle'

import { Notification } from '@/lib/types/Notification'

import { colorPalettes } from '@/constants/Itheme'

import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import beApi from '@/lib/beApi'
import { formatDateTime } from '@/utils/Datetime'
import { useRouter } from 'expo-router'

interface NotificationListProps {
  notificationList: Notification[] | undefined
  removeNotification: (id: number) => void
  markAsRead: (id: number) => void
}

function NotificationList({ notificationList, removeNotification, markAsRead }: NotificationListProps) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()

  const handleNavigate = (notif: Notification) => {
    if (!notif.isSeen) markAsRead(notif.id)

    switch (notif.type) {
      case 'tripGenerated':
      case 'tripGeneratedFailed':
        router.push('/my-trips')
        break
      case 'friendRequestAccepted':
        router.push('/profile')
        break
      default:
        break
    }
  }

  const handleAcceptFriendRequest = async (notif: Notification) => {
    if (!notif.isSeen) markAsRead(notif.id)
    try {
      await beApi.put(`/invitation-friends/accept/${notif.referenceEntity.id}`)
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 80,
        paddingHorizontal: 24,
      }}
    >
      {notificationList?.map((notif) => (
        <Drawer
          key={`${notif.id}-${!notif.isSeen ? 'unread' : 'read'}`}
          leftItem={
            notif.action === 'actionable'
              ? {
                  text: !notif.isSeen ? 'Accept' : 'Accepted',
                  background: !notif.isSeen ? Colors.green30 : Colors.grey50,
                  onPress: !notif.isSeen ? () => handleAcceptFriendRequest(notif) : () => {},
                }
              : undefined
          }
          rightItems={[
            {
              text: 'Delete',
              background: Colors.red30,
              onPress: () => removeNotification(notif.id),
            },
          ]}
          style={{
            borderRadius: Radius.ROUNDED,
            backgroundColor: !notif.isSeen ? theme.secondary : Colors.grey80,
            marginBottom: 10,
          }}
          disableHaptic
          fullSwipeRight
          onFullSwipeRight={() => removeNotification(notif.id)}
          fullSwipeLeft={!notif.isSeen}
          onFullSwipeLeft={() => handleAcceptFriendRequest(notif)}
        >
          <Pressable onPress={notif.action === 'navigable' ? () => handleNavigate(notif) : undefined}>
            <View style={!notif.isSeen ? styles.unreadNotifContainer : styles.notifContainer}>
              <Avatar
                source={
                  notif.triggerEntity.type === 'user'
                    ? { uri: notif.triggerEntity.avatar }
                    : require('@/assets/icons/ios-light.png')
                }
                size={40}
              />

              <View style={styles.view3}>
                {!notif.isSeen ? (
                  <View>
                    <View style={styles.view4}>
                      <Text style={styles.notifTitle}>{notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}</Text>
                      <Text style={styles.subText}>{formatDateTime(notif.createdAt)}</Text>
                    </View>
                    <Text style={styles.text}>{notif.referenceData}</Text>
                  </View>
                ) : (
                  <View>
                    <View style={styles.view4}>
                      <Text style={styles.notifTitleDim}>
                        {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                      </Text>
                      <Text style={styles.subTextDim}>{formatDateTime(notif.createdAt)}</Text>
                    </View>
                    <Text style={styles.textDim}>{notif.referenceData}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        </Drawer>
      ))}
    </ScrollView>
  )
}

export default NotificationList

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    notifContainer: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 20,
      backgroundColor: Colors.grey80,
    },
    unreadNotifContainer: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 20,
      backgroundColor: theme.secondary,
    },
    view3: {
      marginLeft: 10,
      flex: 1,
    },
    view4: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    notifTitle: {
      color: theme.primary,
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
    },
    text: {
      color: theme.text,
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
    },
    subText: {
      color: theme.text,
      fontSize: FontSize.SM,
      fontFamily: FontFamily.ITALIC,
    },
    notifTitleDim: {
      color: theme.dimText,
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
    },
    textDim: {
      color: theme.dimText,
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      clip: 'ellipsis',
    },
    subTextDim: {
      color: theme.dimText,
      fontSize: FontSize.SM,
      fontFamily: FontFamily.ITALIC,
    },
  })
