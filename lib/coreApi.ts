import { EMPTY_STRING } from '@/constants/utilConstants'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import createAxiosInstance from './axios'

// Types
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface QueueItem {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

interface TokenResponse {
  token: string
}

// Constants
const TOKEN_STORAGE_KEY = 'coreAccessToken'
export const CORE_URL = process.env.EXPO_PUBLIC_CORE_API_URL ?? EMPTY_STRING
const SECRET_KEY = process.env.EXPO_PUBLIC_CORE_SECRET_TOKEN

// API instance
const coreApi = createAxiosInstance(CORE_URL)

// Endpoint utilities
const createEndpoint = (path: string) => `${CORE_URL}${path}`

export const ENDPOINTS = {
  AUTH: {
    TOKEN: createEndpoint('/auth/generate_token'),
  },
  PLACES: {
    BASE: createEndpoint('/places'),
    BY_ID: (id: string) => createEndpoint(`/places/${id}`),
  },
  LABELS: {
    BASE: createEndpoint('/labels'),
  },
} as const

// Token refresh state
let isRefreshing = false
let failedQueue: QueueItem[] = []

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

/**
 * Gets a valid token, either from storage or by requesting a new one
 * @param forceRefresh If true, will always request a new token
 * @returns The token string
 */
export const getCoreAccessToken = async (
  forceRefresh = false
): Promise<string> => {
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
    const { data } = await coreApi.post<TokenResponse>(ENDPOINTS.AUTH.TOKEN, {
      secret_key: SECRET_KEY,
    })

    if (typeof data.token !== 'string') {
      throw new Error('Invalid token received from server')
    }

    // Store and setup new token
    await setItemAsync(TOKEN_STORAGE_KEY, data.token)
    coreApi.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    return data.token
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
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) =>
    Promise.reject(error instanceof Error ? error : new Error(String(error)))
)

// Response interceptor
coreApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      try {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        return coreApi(originalRequest)
      } catch {
        return Promise.reject(new Error('Failed to refresh token'))
      }
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newToken = await getCoreAccessToken(true)
      processQueue()

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
      }

      return coreApi(originalRequest)
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError)
      processQueue(new Error('Failed to refresh token'))
      return Promise.reject(new Error('Failed to get new token'))
    } finally {
      isRefreshing = false
    }
  }
)

export default coreApi
