import { checkApiHealth } from '@/common/checkApiHealth'
import { BE_URL } from '@/lib/beApi'
import { CORE_URL } from '@/lib/coreApi'
import { Redirect } from 'expo-router'
import { getItemAsync } from 'expo-secure-store'
import { useEffect, useState } from 'react'

export default function Index() {
  const [state, setState] = useState({
    isLoading: true,
    isServerDown: false,
    isLoggedIn: false,
  })

  useEffect(() => {
    const checkAll = async () => {
      try {
        const [beApiHealth, coreApiHealth, accessToken, refreshToken] = await Promise.all([
          checkApiHealth(BE_URL),
          checkApiHealth(CORE_URL),
          getItemAsync('accessToken'),
          getItemAsync('refreshToken'),
        ])
        setState({
          isLoading: false,
          isServerDown: !beApiHealth || !coreApiHealth,
          isLoggedIn: !!(accessToken && refreshToken),
        })
      } catch (error) {
        setState({ isLoading: false, isServerDown: true, isLoggedIn: false })
      }
    }
    checkAll()
  }, [])

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (state.isServerDown) return <Redirect href="/server-down" />
  if (!state.isLoggedIn) return <Redirect href="/login" />
  return <Redirect href="/(tabs)" />
}
