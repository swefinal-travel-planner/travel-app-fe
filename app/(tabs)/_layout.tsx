import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs, usePathname } from 'expo-router'
import { useMemo } from 'react'
import { Platform, Pressable, StyleSheet } from 'react-native'

export default function TabLayout() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const pathname = usePathname()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.disabled,
        tabBarHideOnKeyboard: true,
        tabBarStyle: pathname.includes('/my-trips/create')
          ? styles.hidden
          : styles.tabBarStyle,
        tabBarLabelStyle: {
          marginTop: 2,
          fontFamily: 'PlusJakartaSans_400Regular',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerPressColor: 'transparent',
          tabBarButton: (props) => (
            <Pressable {...props} android_ripple={null} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="my-trips"
        options={{
          title: 'My trips',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              color={color}
              size={24}
            />
          ),
          tabBarButton: (props) => (
            <Pressable {...props} android_ripple={null} />
          ),
        }}
      />

      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          headerPressColor: 'transparent',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              color={color}
              size={24}
            />
          ),
          tabBarButton: (props) => (
            <Pressable {...props} android_ripple={null} />
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'file-tray' : 'file-tray-outline'}
              color={color}
              size={24}
            />
          ),
          tabBarButton: (props) => (
            <Pressable {...props} android_ripple={null} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={24}
            />
          ),
          tabBarButton: (props) => (
            <Pressable {...props} android_ripple={null} />
          ),
        }}
      />
    </Tabs>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    tabBarStyle: {
      paddingTop: 5,
      height: Platform.OS === 'ios' ? 90 : 80,
      borderColor: theme.disabled,
      backgroundColor: theme.white,
    },
    hidden: {
      display: 'none',
    },
  })
