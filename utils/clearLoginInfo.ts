import * as SecureStore from 'expo-secure-store'

export async function clearLoginInfo(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync('userId'),
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
      SecureStore.deleteItemAsync('email'),
      SecureStore.deleteItemAsync('name'),
    ])
  } catch (error) {
    console.error('Error clearing login info:', error)
  }
}
