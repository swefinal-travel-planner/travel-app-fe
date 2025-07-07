import { EMPTY_STRING } from '@/constants/utilConstants'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import Constants from 'expo-constants'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import createAxiosInstance from './axios'

/**
 * Core API Configuration with Silent Error Handling
 *
 * This module provides an enhanced core API client that handles token refresh automatically
 * and suppresses error popups during authentication failures to improve UX.
 *
 * Key Features:
 * - Automatic token refresh on 401 errors
 * - Silent error handling to prevent popup spam
 * - Queue system for concurrent requests during refresh
 * - Graceful degradation when refresh fails
 *
 * Usage:
 * 1. Use `safeCoreApiCall()` wrapper for API calls that should handle silent errors
 * 2. Use `handleCoreApiResponse()` to process responses and check for silent errors
 * 3. Direct `coreApi` calls will still work but may show error popups
 *
 * Example:
 * ```typescript
 * // Correct pattern for using safeCoreApiCall with status checking
 * const response = await safeCoreApiCall(() => coreApi.get('/places'))
 *
 * // Always check for null first (silent error)
 * if (!response) {
 *   // Silent error occurred, handle gracefully
 *   return []
 * }
 *
 * // Now you can safely access response.status and response.data
 * if (response.status === 200) {
 *   const places = response.data.data
 *   return places
 * }
 *
 * // For POST requests
 * const postResponse = await safeCoreApiCall(() => coreApi.post('/distance_time/calc', data))
 * if (!postResponse) {
 *   // Handle silent error
 *   return null
 * }
 *
 * if (postResponse.status === 200) {
 *   // Success
 *   return postResponse.data
 * }
 * ```
 */

// Types
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface QueueItem {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

// Constants
const TOKEN_STORAGE_KEY = 'coreAccessToken'
export const CORE_URL = process.env.EXPO_PUBLIC_CORE_API_URL ?? EMPTY_STRING
const SECRET_KEY = Constants.expoConfig?.extra?.coreSecretToken ?? EMPTY_STRING

// API instance
const coreApi = createAxiosInstance(CORE_URL)

// Token refresh state
let isRefreshing = false
let failedQueue: QueueItem[] = []
let refreshAttempts = 0
const MAX_REFRESH_ATTEMPTS = 1

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve()
    }
  })
  failedQueue = []
}

// Utility function to handle silent error responses
export const handleCoreApiResponse = (response: any) => {
  if (response && response.silent) {
    // Handle silent errors - don't show popups but log for debugging
    console.log('Silent Core API error:', response.message || 'Authentication failed')
    return null
  }
  return response
}

// Wrapper function for API calls that handles silent errors
export const safeCoreApiCall = async (apiCall: () => Promise<any>) => {
  try {
    const response = await apiCall()
    return handleCoreApiResponse(response)
  } catch (error) {
    console.log('Error in safeCoreApiCall:', error)
    // Check if it's a silent error response
    if (error && typeof error === 'object' && 'silent' in error) {
      return handleCoreApiResponse(error)
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Gets a valid token, either from storage or by requesting a new one
 * @param forceRefresh If true, will always request a new token
 * @returns The token string
 */
export const getCoreAccessToken = async (forceRefresh = false): Promise<string> => {
  if (!SECRET_KEY) {
    throw new Error('Secret token not found in environment variables')
  }

  try {
    // Try to get existing token if not forcing refresh
    if (!forceRefresh) {
      const existingToken = await getItemAsync(TOKEN_STORAGE_KEY)
      if (existingToken) {
        return existingToken
      }
    }

    // Get new token
    const response = await coreApi.post('/auth/generate_token', {
      secret_key: SECRET_KEY,
    })

    if (typeof response.data.token !== 'string') {
      throw new Error('Invalid token received from server')
    }

    // Store and setup new token
    await setItemAsync(TOKEN_STORAGE_KEY, response.data.token)
    coreApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

    return response.data.token
  } catch (error) {
    await setItemAsync(TOKEN_STORAGE_KEY, '')
    throw error instanceof Error ? error : new Error('Failed to get token')
  }
}

// Request interceptor
coreApi.interceptors.request.use(
  async (config) => {
    const token = await getItemAsync(TOKEN_STORAGE_KEY)
    if (token && typeof token === 'string') {
      config.headers.Authorization = `Bearer ${token} `
    }
    return config
  },
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
)

// Response interceptor
coreApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      try {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        return coreApi(originalRequest)
      } catch (err) {
        // Only show error if we've exhausted refresh attempts
        if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
          return Promise.reject(new Error('Failed to refresh token'))
        }
        // Silently fail and let the user continue
        return Promise.resolve({ status: 401, data: null, silent: true })
      }
    }

    originalRequest._retry = true
    isRefreshing = true
    refreshAttempts++

    try {
      const newToken = await getCoreAccessToken(true)

      // Reset refresh attempts on successful refresh
      refreshAttempts = 0

      processQueue()

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken} `
      }

      return coreApi(originalRequest)
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError)

      // Only clear tokens and show error if we've exhausted all attempts
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        processQueue(new Error('Failed to refresh token'))
        return Promise.reject(new Error('Failed to get new token'))
      } else {
        // For first attempt, process queue with error but don't throw
        processQueue(new Error('Failed to refresh token'))

        // Return a silent error response instead of throwing
        return Promise.resolve({
          status: 401,
          data: null,
          silent: true,
          message: 'Core API authentication failed',
        })
      }
    } finally {
      isRefreshing = false
    }
  }
)

export default coreApi
