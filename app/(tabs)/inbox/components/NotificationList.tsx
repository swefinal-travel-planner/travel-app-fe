import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Colors, Drawer } from 'react-native-ui-lib'

import { useThemeStyle } from '@/hooks/useThemeStyle'

import { Notification } from '@/lib/types/Notification'

import { colorPalettes } from '@/styles/Itheme'

import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { formatDateTime } from '@/utils/Datetime'

interface NotificationListProps {
  notificationList: Notification[]
  removeNotification: (id: number) => void
  markAsRead: (id: number) => void
}

function NotificationList({
  notificationList,
  removeNotification,
  markAsRead,
}: NotificationListProps) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 80,
        paddingHorizontal: 24,
      }}
    >
      {notificationList.map((notif) => (
        <Drawer
          key={`${notif.id}-${notif.unread ? 'unread' : 'read'}`}
          leftItem={
            notif.type === 'actionable'
              ? {
                  text: notif.unread ? 'Accept' : 'Accepted',
                  background: notif.unread ? Colors.green30 : Colors.grey50,
                  onPress: notif.unread ? () => markAsRead(notif.id) : () => {},
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
            backgroundColor: notif.unread ? theme.secondary : Colors.grey80,
            marginBottom: 10,
          }}
          disableHaptic
          fullSwipeRight
          onFullSwipeRight={() => removeNotification(notif.id)}
          fullSwipeLeft={notif.unread}
          onFullSwipeLeft={() => markAsRead(notif.id)}
        >
          <Pressable
            onPress={
              notif.type === 'navigable'
                ? () => markAsRead(notif.id)
                : undefined
            }
          >
            <View
              style={
                notif.unread
                  ? styles.unreadNotifContainer
                  : styles.notifContainer
              }
            >
              <Avatar source={notif.senderAvatar} size={40} />

              <View style={styles.view3}>
                {notif.unread ? (
                  <View>
                    <View style={styles.view4}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.subText}>
                        {formatDateTime(notif.date, notif.time)}
                      </Text>
                    </View>
                    <Text style={styles.text}>{notif.message}</Text>
                  </View>
                ) : (
                  <View>
                    <View style={styles.view4}>
                      <Text style={styles.notifTitleDim}>{notif.title}</Text>
                      <Text style={styles.subTextDim}>
                        {formatDateTime(notif.date, notif.time)}
                      </Text>
                    </View>
                    <Text style={styles.textDim}>{notif.message}</Text>
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
      clip: 'ellipsis',
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
