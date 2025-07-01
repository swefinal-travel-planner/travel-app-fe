import { getItemAsync, setItemAsync } from 'expo-secure-store'
import createAxiosInstance from './axios'
import { EMPTY_STRING } from '@/constants/utilConstants'

export const BE_URL = process.env.EXPO_PUBLIC_BE_API_URL ?? EMPTY_STRING

const beApi = createAxiosInstance(BE_URL)

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
beApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getItemAsync('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error.response)))
  }
)

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
    if (error.response && error.response.status === 401 && !originalRequest.hasRetry) {
      originalRequest.hasRetry = true

      if (isRefreshing) {
        // Queue the request until the token is refreshed
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            // token is of type unknown, so we need to check/cast
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

        // Call refresh endpoint
        const refreshResponse = await beApi.post('/auth/refresh', { refreshToken })

        const newAccessToken = refreshResponse.data.data

        // Save new tokens
        await setItemAsync('accessToken', newAccessToken)

        processQueue(null, newAccessToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken
        return beApi(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Optionally, you can clear tokens here or redirect to login
        return Promise.reject(new Error('Failed to refresh token: ' + refreshError))
      } finally {
        isRefreshing = false
      }
    }

    console.error('Response Error:', error.response)
    return Promise.reject(new Error(error.response))
  }
)

export default beApi
