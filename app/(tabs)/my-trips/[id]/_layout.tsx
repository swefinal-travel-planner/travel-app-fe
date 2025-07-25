import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useTripId } from '@/hooks/useTripId'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs, useRouter, useSegments } from 'expo-router'
import React, { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TripDetailLayout() {
  const router = useRouter()
  const segments = useSegments()
  const tripId = useTripId()
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const isModifyScreen = (segments as string[]).includes('modify')

  // Component tùy chỉnh cho tab label
  const CustomTabLabel = ({ label, focused }: { label: string; focused: boolean }) => (
    <View style={styles.tabContainer}>
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>{label}</Text>
      {focused && <View style={styles.tabIndicator} />}
    </View>
  )

  return (
    <>
      {/* Header */}
      {!isModifyScreen && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      )}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.disabled,
          tabBarPosition: 'top',
          tabBarStyle: {
            elevation: 0,
            backgroundColor: theme.white,
            height: isModifyScreen ? 0 : 60,
            borderBottomWidth: 0,
            borderBottomColor: theme.primary,
            paddingTop: 0,
            paddingHorizontal: 16,
          },
          tabBarItemStyle: {
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: FontSize.LG,
            textTransform: 'none',
            fontFamily: FontFamily.REGULAR,
          },
          tabBarIconStyle: {
            display: 'none',
          },
        }}
      >
        <Tabs.Screen
          name="details"
          options={{
            title: 'Details',
            tabBarLabel: ({ focused }) => <CustomTabLabel label="Details" focused={focused} />,
            href: { pathname: '/my-trips/[id]/details', params: { id: tripId } },
          }}
        />
        <Tabs.Screen
          name="companions"
          options={{
            title: 'Companions',
            tabBarLabel: ({ focused }) => <CustomTabLabel label="Companions" focused={focused} />,
            href: { pathname: '/my-trips/[id]/companions', params: { id: tripId } },
          }}
        />
        <Tabs.Screen
          name="album"
          options={{
            title: 'Album',
            tabBarLabel: ({ focused }) => <CustomTabLabel label="Album" focused={focused} />,
            href: { pathname: '/my-trips/[id]/album', params: { id: tripId } },
          }}
        />
      </Tabs>
    </>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: '#fff',
      paddingTop: 40,
      paddingBottom: 16,
    },
    headerTitle: {
      marginLeft: 15,
      fontSize: FontSize.SM,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
    },
    tabContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: '100%',
    },
    tabBarLabel: {
      fontSize: FontSize.LG,
      textTransform: 'none',
      fontFamily: FontFamily.REGULAR,
      color: theme.disabled,
    },
    tabBarLabelActive: {
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
    },
    tabIndicator: {
      position: 'absolute',
      zIndex: -1,
      top: 2,
      backgroundColor: theme.secondary,
      width: '100%',
      height: '100%',
      borderRadius: Radius.FULL,
    },
  })
