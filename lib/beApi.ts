import { EMPTY_STRING } from '@/constants/utilConstants'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import createAxiosInstance from './axios'

export const BE_URL = process.env.EXPO_PUBLIC_BE_API_URL ?? EMPTY_STRING
const beApi = createAxiosInstance(BE_URL)
const refreshApi = createAxiosInstance(BE_URL)

let isRefreshing = false
let failedQueue: any[] = []
let refreshAttempts = 0
const MAX_REFRESH_ATTEMPTS = 1

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

// Utility function to handle silent error responses
export const handleApiResponse = (response: any) => {
  if (response && response.silent) {
    // Handle silent errors - don't show popups but log for debugging
    console.log('Silent API error:', response.message || 'Authentication failed')
    return null
  }
  return response
}

// Wrapper function for API calls that handles silent errors
export const safeBeApiCall = async (apiCall: () => Promise<any>) => {
  try {
    const response = await apiCall()
    console.log('entering safeBeApiCall')
    return handleApiResponse(response)
  } catch (error) {
    // Check if it's a silent error response
    if (error && typeof error === 'object' && 'silent' in error) {
      return handleApiResponse(error)
    }
    // Re-throw other errors
    throw error
  }
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

    // Don't attempt token refresh for authentication endpoints
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/google-login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/refresh')

    if (is401Error && !originalRequest._retry && !isAuthEndpoint) {
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
            // Only show error if we've exhausted refresh attempts
            if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
              return Promise.reject(new Error('Failed to refresh token: ' + err))
            }
            // Silently fail and let the user continue
            return Promise.resolve({ status: 401, data: null, silent: true })
          })
      }

      isRefreshing = true
      refreshAttempts++

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

        // Reset refresh attempts on successful refresh
        refreshAttempts = 0

        processQueue(null, newAccessToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken
        return beApi(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError)

        // Only clear tokens and show error if we've exhausted all attempts
        if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
          processQueue(refreshError, null)

          // Clear tokens on refresh failure
          await setItemAsync('accessToken', '')
          await setItemAsync('refreshToken', '')

          return Promise.reject(new Error('Failed to refresh token: ' + refreshError))
        } else {
          // For first attempt, process queue with error but don't throw
          processQueue(refreshError, null)

          // Return a silent error response instead of throwing
          return Promise.resolve({
            status: 401,
            data: null,
            silent: true,
            message: 'Authentication failed, please login again',
          })
        }
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

/**
 * Backend API Configuration with Silent Error Handling
 *
 * This module provides an enhanced API client that handles token refresh automatically
 * and suppresses error popups during authentication failures to improve UX.
 *
 * Key Features:
 * - Automatic token refresh on 401 errors
 * - Silent error handling to prevent popup spam
 * - Queue system for concurrent requests during refresh
 * - Graceful degradation when refresh fails
 *
 * Usage:
 * 1. Use `safeBeApiCall()` wrapper for API calls that should handle silent errors
 * 2. Use `handleApiResponse()` to process responses and check for silent errors
 * 3. Direct `beApi` calls will still work but may show error popups
 *
 * Example:
 * ```typescript
 * // Correct pattern for using safeBeApiCall with status checking
 * const response = await safeBeApiCall(() => beApi.get('/users/me'))
 *
 * // Always check for null first (silent error)
 * if (!response) {
 *   // Silent error occurred, handle gracefully
 *   return
 * }
 *
 * // Now you can safely access response.status and response.data
 * if (response.status === 200) {
 *   const userData = response.data
 *   // Process user data
 * }
 *
 * // For POST requests
 * const postResponse = await safeBeApiCall(() => beApi.post('/users', userData))
 * if (!postResponse) {
 *   // Handle silent error
 *   return
 * }
 *
 * if (postResponse.status === 201) {
 *   // Success
 * }
 * ```
 */
