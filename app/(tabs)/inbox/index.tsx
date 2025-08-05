import Chip from '@/components/Chip'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useNotifications } from '@/hooks/useNotifications'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { NotificationCategory } from '@/lib/types/Notification'
import { NotificationService } from '@/services/notificationService'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import NotificationList from './components/NotificationList'

export default function Inbox() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const {
    filteredNotifications,
    availableCategories,
    activeCategories,
    setActiveCategories,
    removeNotification,
    markAsRead,
    isLoading,
    error,
  } = useNotifications()

  const handleCategorySelect = (category: string) => {
    if (category === 'all') {
      setActiveCategories([])
    } else {
      // Single selection: replace current selection with the new one
      setActiveCategories([category as NotificationCategory])
    }
  }

  const handleCategoryDeselect = (category: string) => {
    if (category === 'all') {
      // If "All" is deselected, select the first available category
      setActiveCategories([availableCategories[0]])
    } else {
      // If a specific category is deselected, switch to "All"
      setActiveCategories([])
    }
  }

  const isAllSelected = activeCategories.length === 0

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )
    }

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.regularText}>Loading notifications...</Text>
        </View>
      )
    }

    if (filteredNotifications?.length === 0) {
      return (
        <View style={styles.noNotifContainer}>
          <Ionicons name="notifications-off-outline" size={48} color={theme.text} />
          <Text style={styles.regularText}>No notifications</Text>
        </View>
      )
    }

    return (
      <NotificationList
        notificationList={filteredNotifications}
        removeNotification={removeNotification}
        markAsRead={markAsRead}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <Chip
            key="all"
            value="All"
            size="large"
            isSelected={isAllSelected}
            onSelect={() => handleCategorySelect('all')}
            onDeselect={() => handleCategoryDeselect('all')}
          />
          {availableCategories.map((category) => (
            <Chip
              key={category}
              value={NotificationService.getCategoryLabel(category)}
              size="large"
              isSelected={activeCategories.includes(category)}
              onSelect={() => handleCategorySelect(category)}
              onDeselect={() => handleCategoryDeselect(category)}
            />
          ))}
        </ScrollView>
      </View>

      {renderContent()}
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
    loadingContainer: {
      flexDirection: 'column',
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    errorText: {
      color: theme.error || '#ff0000',
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      textAlign: 'center',
    },
    regularText: {
      color: theme.text,
      fontSize: FontSize.LG,
      fontFamily: FontFamily.REGULAR,
      marginTop: 10,
    },
  })
