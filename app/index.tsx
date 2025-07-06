import { checkApiHealth } from '@/common/checkApiHealth'
import { BE_URL } from '@/lib/beApi'
import { CORE_URL } from '@/lib/coreApi'
import { Redirect } from 'expo-router'
import { getItemAsync } from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const [isServerDown, setIsServerDown] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkApiHealthStatus = async () => {
      try {
        const beApiHealth = await checkApiHealth(BE_URL)
        const coreApiHealth = await checkApiHealth(CORE_URL)

        if (!beApiHealth || !coreApiHealth) {
          setIsServerDown(true)
        } else {
          // If APIs are healthy, redirect to main app
          setIsServerDown(false)
        }
      } catch (error) {
        console.error('Error checking API health:', error)
        setIsServerDown(true)
      } finally {
        setIsLoading(false)
      }
    }

    const checkUserLoggedIn = async () => {
      const accessToken = await getItemAsync('accessToken')
      const refreshToken = await getItemAsync('refreshToken')
      if (accessToken && refreshToken) {
        setIsLoggedIn(true)
      }
    }
    checkUserLoggedIn()
    checkApiHealthStatus()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isServerDown) {
    // Show a debug for BE_URL and CORE_URL with UI
    return <Redirect href="/server-down" />
  }

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return <Redirect href="/login" />
  }

  // If APIs are healthy, redirect to main app (you can change this to your main route)
  return <Redirect href="/(tabs)" />
}
