import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'

import beApi, { BE_URL } from '@/lib/beApi'
import axios from 'axios'

export default async function updateNotifToken(): Promise<void> {
  try {
    let token = await SecureStore.getItemAsync('expoPushToken')

    if (!token || token === '') {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId

      if (!projectId) {
        console.error('From updateNotifToken: project ID not found')
        return
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data

      await SecureStore.setItemAsync('expoPushToken', token)
    }

    const payload = {
      notificationToken: token,
    }

    await beApi.put(`${BE_URL}/users/notification-token`, payload)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // handle errors coming from the API call
      console.error('API error:', error.response?.data || error.message)
    } else {
      console.error('Error updating user notification token:', error)
    }
  }
}
