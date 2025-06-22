import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs, useRouter, useSegments } from 'expo-router'
import React from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

// Lấy chiều rộng màn hình để tính toán kích thước tab
const SCREEN_WIDTH = Dimensions.get('window').width
const TAB_WIDTH = SCREEN_WIDTH / 3 // Chia cho 3 tab

export default function TripDetailLayout() {
  const router = useRouter()
  const segments = useSegments()

  const isModifyScreen = segments.includes('modify')

  // Component tùy chỉnh cho tab label
  const CustomTabLabel = ({
    label,
    focused,
  }: {
    label: string
    focused: boolean
  }) => (
    <View style={styles.tabContainer}>
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>
        {label}
      </Text>
      {focused && <View style={styles.tabIndicator} />}
    </View>
  )

  return (
    <>
      {/* Header */}
      {!isModifyScreen && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      )}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#563D30',
          tabBarInactiveTintColor: '#A68372',
          tabBarPosition: 'top',
          tabBarStyle: {
            elevation: 0,
            backgroundColor: '#FFFFFF',
            height: isModifyScreen ? 0 : 40,
            borderBottomWidth: isModifyScreen ? 0 : 1,
            borderBottomColor: '#A68372',
            paddingTop: 0,
          },
          tabBarItemStyle: {
            height: 40,
            width: TAB_WIDTH,
          },
          tabBarLabelStyle: {
            fontSize: 20,
            textTransform: 'none',
            fontFamily: 'PlusJakartaSans_400Regular',
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
            tabBarLabel: ({ focused }) => (
              <CustomTabLabel label="Details" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="companions"
          options={{
            title: 'Companions',
            tabBarLabel: ({ focused }) => (
              <CustomTabLabel label="Companions" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="album"
          options={{
            title: 'Album',
            tabBarLabel: ({ focused }) => (
              <CustomTabLabel label="Album" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  headerTitle: {
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#563D30',
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
    height: 40,
    position: 'relative',
    width: '100%',
  },
  tabBarLabel: {
    fontSize: 20,
    textTransform: 'none',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#A68372',
  },
  tabBarLabelActive: {
    color: '#563D30',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#563D30',
    width: '100%',
  },
})
