import { ToastProvider } from '@/components/ToastContext'
import { getCoreAccessToken } from '@/lib/coreApi'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Mapbox from '@rnmapbox/maps'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'

// Types
interface NotificationState {
  notification: Notifications.Notification | undefined
  isReady: boolean
  isHealthy: boolean
}

// Constants
const GOOGLE_WEB_CLIENT_ID = '490333496504-qe9p6s4an7ub4ros021q2p6kda9hakhm.apps.googleusercontent.com'
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''

// Configuration
const configureNotifications = () => {
  Notifications.setNotificationHandler({
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
  console.error(errorMessage)
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
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    const finalStatus =
      existingStatus === 'granted' ? existingStatus : (await Notifications.requestPermissionsAsync()).status

    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted for push notifications')
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
    if (!projectId) {
      handleRegistrationError('Project ID not found')
    }

    const { data: pushTokenString } = await Notifications.getExpoPushTokenAsync({ projectId })
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

  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

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
      setState((prev) => ({ ...prev, isReady: true, isHealthy: true }))
    } catch (error) {
      console.error('App initialization error:', error)
      setState((prev) => ({ ...prev, isReady: true, isHealthy: false }))
    } finally {
      await SplashScreen.hideAsync()
    }
  }, [])

  useEffect(() => {
    initializeApp()

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) =>
      setState((prev) => ({ ...prev, notification }))
    )

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) =>
      console.log('Notification response:', response)
    )

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [initializeApp])

  if (!state.isReady) {
    return null
  }

  return (
    <>
      <ToastProvider>
        <StatusBar style="auto" />
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)/login/index" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </ToastProvider>
    </>
  )
}
