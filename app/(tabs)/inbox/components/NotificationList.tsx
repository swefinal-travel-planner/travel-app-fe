import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Colors, Drawer } from 'react-native-ui-lib'

import { useThemeStyle } from '@/hooks/useThemeStyle'

import { Notification } from '@/lib/types/Notification'

import { colorPalettes } from '@/constants/Itheme'

import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { formatDateTime } from '@/utils/Datetime'

interface NotificationListProps {
  notificationList: Notification[] | undefined
  removeNotification: (id: number) => void
  markAsRead: (id: number) => void
}

function NotificationList({ notificationList, removeNotification, markAsRead }: NotificationListProps) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

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
                  onPress: !notif.isSeen ? () => markAsRead(notif.id) : () => {},
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
          onFullSwipeLeft={() => markAsRead(notif.id)}
        >
          <Pressable onPress={notif.action === 'navigable' ? () => markAsRead(notif.id) : undefined}>
            <View style={!notif.isSeen ? styles.unreadNotifContainer : styles.notifContainer}>
              <Avatar
                source={
                  notif.triggerEntity.type === 'user'
                    ? notif.triggerEntity.avatar
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
