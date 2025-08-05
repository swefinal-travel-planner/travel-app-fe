import { ToastProvider } from '@/components/ToastContext'
import { EMPTY_STRING } from '@/constants/utilConstants'
import { getCoreAccessToken } from '@/lib/coreApi'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Mapbox from '@rnmapbox/maps'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Constants from 'expo-constants'
import {
  setNotificationHandler,
  Notification,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  EventSubscription,
} from 'expo-notifications'
import { Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LogBox, Platform } from 'react-native'

LogBox.ignoreAllLogs() // Ignore all log notifications

interface NotificationState {
  notification: Notification | undefined
  isReady: boolean
  isHealthy: boolean
}

const GOOGLE_WEB_CLIENT_ID = '490333496504-qe9p6s4an7ub4ros021q2p6kda9hakhm.apps.googleusercontent.com'
const MAPBOX_TOKEN = Constants.expoConfig?.extra?.mapboxAccessToken ?? EMPTY_STRING

const configureNotifications = () => {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })
}

const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
}

const configureMapbox = () => {
  Mapbox.setAccessToken(MAPBOX_TOKEN)
}

// Utility functions
const handleRegistrationError = (errorMessage: string): never => {
  console.error('Error in handleRegistrationError:', errorMessage)
  throw new Error(errorMessage)
}

const updateUserPushToken = async (token: string): Promise<void> => {
  if (!token) return

  try {
    await SecureStore.setItemAsync('expoPushToken', token)
  } catch (error) {
    console.error('Error storing push token:', error)
  }
}

const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
  try {
    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    const { status: existingStatus } = await getPermissionsAsync()
    const finalStatus = existingStatus === 'granted' ? existingStatus : (await requestPermissionsAsync()).status

    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted for push notifications')
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
    if (!projectId) {
      handleRegistrationError('Project ID not found')
    }

    const { data: pushTokenString } = await getExpoPushTokenAsync({ projectId })
    return pushTokenString
  } catch (error) {
    console.error('Push notification registration error:', error)
    return undefined
  }
}

// Main Component
export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())

  const [state, setState] = useState<NotificationState>({
    notification: undefined,
    isReady: false,
    isHealthy: false,
  })

  const notificationListener = useRef<EventSubscription>()
  const responseListener = useRef<EventSubscription>()

  const initializeApp = useCallback(async () => {
    try {
      await SplashScreen.preventAutoHideAsync()
      configureMapbox()
      configureNotifications()
      configureGoogleSignIn()

      const token = await registerForPushNotificationsAsync()

      if (token) {
        await updateUserPushToken(token)
      }

      await getCoreAccessToken()
      setState((prev: NotificationState) => ({ ...prev, isReady: true, isHealthy: true }))
    } catch (error) {
      console.error('App initialization error:', error)
      setState((prev: NotificationState) => ({ ...prev, isReady: true, isHealthy: false }))
    }
  }, [])

  const hideSplashScreen = async () => {
    await SplashScreen.hideAsync()
  }

  useEffect(() => {
    initializeApp()

    hideSplashScreen()

    notificationListener.current = addNotificationReceivedListener((notification) =>
      setState((prev: NotificationState) => ({ ...prev, notification }))
    )

    responseListener.current = addNotificationResponseReceivedListener((response) =>
      console.log('Notification response:', response)
    )

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  })

  if (!state.isReady) {
    return null
  }

  return (
    <ToastProvider>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/login/index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
    </ToastProvider>
  )
}
