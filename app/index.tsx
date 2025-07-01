import { checkApiHealth } from '@/common/checkApiHealth'
import { BE_URL } from '@/lib/beApi'
import { CORE_URL } from '@/lib/coreApi'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const [isServerDown, setIsServerDown] = useState(false)

  // If either BE_URL or CORE_URL is not set, show them and do not continue
  if (!BE_URL || !CORE_URL) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>API URLs are not set</Text>
        <Text style={{ marginBottom: 8 }}>BE_URL: {String(BE_URL)}</Text>
        <Text style={{ marginBottom: 8 }}>CORE_URL: {String(CORE_URL)}</Text>
        <Text style={{ color: 'red', marginTop: 16 }}>Please check your environment configuration.</Text>
      </View>
    )
  }

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

  // If APIs are healthy, redirect to main app (you can change this to your main route)
  return <Redirect href="/(tabs)" />
}
