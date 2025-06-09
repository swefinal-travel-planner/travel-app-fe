import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Mapbox from '@rnmapbox/maps'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'

// prevent the splash screen from hiding before the font finishes loading
SplashScreen.preventAutoHideAsync()

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '')

// configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage)
  throw new Error(errorMessage)
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()

  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    handleRegistrationError(
      'Permission not granted to get push token for push notification!'
    )
    return
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId

  if (!projectId) {
    handleRegistrationError('Project ID not found')
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data

    return pushTokenString
  } catch (e: unknown) {
    handleRegistrationError(`${e}`)
  }
}

const updateUserPushToken = async (token: string) => {
  if (!token) {
    return
  }

  try {
    await SecureStore.setItemAsync('expoPushToken', token)

    console.log('Push token stored successfully:', token)
  } catch (error) {
    console.error('Error storing push token:', error)
  }
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())
  const [isReady, setIsReady] = useState(false)
  const [isHealthy, setIsHealthy] = useState(false)

  // TODO: might need to set this in store to update the Inbox screen
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined)
  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    SplashScreen.hideAsync()

    // configure Google sign-in
    GoogleSignin.configure({
      webClientId:
        '490333496504-qe9p6s4an7ub4ros021q2p6kda9hakhm.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    })
  }, [])

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => updateUserPushToken(token ?? ''))
      .catch((error: any) => console.log(`${error}`))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )

      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
    </>
  )
}
