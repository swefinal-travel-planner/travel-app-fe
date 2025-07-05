import { EMPTY_STRING } from '@/constants/utilConstants'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import createAxiosInstance from './axios'

export const BE_URL = process.env.EXPO_PUBLIC_BE_API_URL ?? EMPTY_STRING
const beApi = createAxiosInstance(BE_URL)
const refreshApi = createAxiosInstance(BE_URL)

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Add authentication interceptor
beApi.interceptors.request.use(async (config) => {
  const accessToken = await getItemAsync('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Add response interceptor to handle 204 responses and 401 refresh
beApi.interceptors.response.use(
  // If the response is successful, just return it
  (response) => {
    return response
  },

  // Handle errors
  async (error) => {
    const originalRequest = error.config

    // If the error has a response and it's a 204, treat it as success
    if (error.response && error.response.status === 204) {
      console.log('Received 204 No Content - treating as success')
      return Promise.resolve({ status: 204, data: null })
    }

    // Handle 401 Unauthorized and try to refresh token
    // Check both error.response.status and error.status for 401
    const is401Error =
      (error.response && error.response.status === 401) || error.status === 401 || error.message?.includes('401')

    if (is401Error && !originalRequest._retry) {
      console.log('Received 401 Unauthorized - attempting to refresh token')
      originalRequest._retry = true

      if (isRefreshing) {
        // Queue the request until the token is refreshed
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (typeof token !== 'string') {
              return Promise.reject(new Error('Invalid token type'))
            }
            originalRequest.headers.Authorization = 'Bearer ' + token
            return beApi(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(new Error('Failed to refresh token: ' + err))
          })
      }

      isRefreshing = true
      try {
        const refreshToken = await getItemAsync('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        console.log('Making refresh token request...')

        // Use the separate refreshApi instance to avoid interceptor loops
        const refreshResponse = await refreshApi.post('/auth/refresh', {
          refreshToken: refreshToken,
        })

        const newAccessToken = refreshResponse.data.data
        if (!newAccessToken) {
          throw new Error('No access token received from refresh')
        }

        // Save new access token
        await setItemAsync('accessToken', newAccessToken)

        processQueue(null, newAccessToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken
        return beApi(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError)
        processQueue(refreshError, null)

        // Clear tokens on refresh failure
        await setItemAsync('accessToken', '')
        await setItemAsync('refreshToken', '')

        return Promise.reject(new Error('Failed to refresh token: ' + refreshError))
      } finally {
        isRefreshing = false
      }
    }

    // For other errors, just reject
    console.error('Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default beApi
