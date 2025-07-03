import * as SecureStore from 'expo-secure-store'

export default async function saveLoginInfo(
  userId: number,
  phoneNumber: string,
  accessToken: string,
  refreshToken: string,
  email: string,
  name: string,
  profilePic: string
): Promise<void> {
  try {
    await SecureStore.setItemAsync('userId', userId.toString())
    await SecureStore.setItemAsync('accessToken', accessToken)
    await SecureStore.setItemAsync('refreshToken', refreshToken)
    await SecureStore.setItemAsync('email', email)
    await SecureStore.setItemAsync('phoneNumber', phoneNumber)
    await SecureStore.setItemAsync('name', name)
    await SecureStore.setItemAsync('profilePic', profilePic)
  } catch (error) {
    console.error('Error saving login info:', error)
  }
}
