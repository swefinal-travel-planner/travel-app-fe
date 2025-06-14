import { getItemAsync } from 'expo-secure-store'
import createAxiosInstance from './axios'

export const BE_URL =
  process.env.EXPO_PUBLIC_BE_API_URL ?? 'http://localhost:3000/beApi/v1'

const beApi = createAxiosInstance(BE_URL)

// Add authentication interceptor
beApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getItemAsync('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error.response))
    )
  }
)

// Add response interceptor to handle 204 responses
beApi.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    })
    return response
  },
  (error) => {
    // If the error has a response and it's a 204, treat it as success
    if (error.response && error.response.status === 204) {
      console.log('Received 204 No Content - treating as success')
      return Promise.resolve({ status: 204, data: null })
    }
    console.error('Response Error:', error.response)
    return Promise.reject(new Error(error.response))
  }
)

export default beApi
