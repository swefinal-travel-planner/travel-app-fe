import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import { useThemeStyle } from '@/hooks/useThemeStyle'

import { Notification, NotificationCategory } from '@/lib/types/Notification'

import { colorPalettes } from '@/constants/Itheme'

import Chip from '@/components/Chip'
import { FontFamily, FontSize } from '@/constants/font'
import inbox from '@/lib/mock_data/inbox'
import NotificationList from './components/NotificationList'

export default function Inbox() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [notifications, setNotifications] = useState<Notification[]>(
    inbox as Notification[]
  )

  const categories: NotificationCategory[] = [
    'friends',
    'locations',
    'trips',
    'reminders',
    'weather',
  ]

  const [activeCategories, setActiveCategories] = useState<
    NotificationCategory[]
  >([])

  const filteredNotifications =
    activeCategories.length === 0
      ? notifications
      : notifications.filter((n) =>
          activeCategories.includes(
            n.category.toLowerCase() as NotificationCategory
          )
        )

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    )
  }

  // useEffect(() => {
  //   console.log('Active categories changed:', activeCategories)
  // }, [activeCategories])

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <Text style={styles.filtersTitle}>Filter:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              value={cat.charAt(0).toUpperCase() + cat.slice(1)}
              size="small"
              onSelect={() => setActiveCategories([...activeCategories, cat])}
              onDeselect={() =>
                setActiveCategories(activeCategories.filter((c) => c !== cat))
              }
            />
          ))}
        </ScrollView>
      </View>

      {filteredNotifications.length === 0 ? (
        <View style={styles.noNotifContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={theme.text}
          />

          <Text style={styles.regularText}>No notifications</Text>
        </View>
      ) : (
        <NotificationList
          notificationList={filteredNotifications}
          removeNotification={removeNotification}
          markAsRead={markAsRead}
        />
      )}
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      paddingTop: 40,
      flexDirection: 'column',
      height: '100%',
      backgroundColor: theme.white,
    },
    filtersTitle: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.LG,
      color: theme.primary,
      marginRight: 10,
    },
    filters: {
      flexDirection: 'row',
      marginVertical: 20,
      paddingHorizontal: 20,
    },
    noNotifContainer: {
      flexDirection: 'column',
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    regularText: {
      color: theme.text,
      fontSize: FontSize.LG,
      fontFamily: FontFamily.REGULAR,
      marginTop: 10,
    },
  })
