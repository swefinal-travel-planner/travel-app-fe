import { EMPTY_STRING } from '@/constants/utilConstants'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import createAxiosInstance from './axios'

// Extended type for request config with _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const CORE_URL = process.env.EXPO_PUBLIC_CORE_API_URL ?? EMPTY_STRING

// Core API for all requests
const coreApi = createAxiosInstance(CORE_URL)

// Function to create endpoint URL
export const createEndpoint = (path: string) => `${CORE_URL}${path}`

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    TOKEN: createEndpoint('/auth/generate_token'),
  },
  PLACES: {
    BASE: createEndpoint('/places'),
    BY_ID: (id: string) => createEndpoint(`/places/${id}`),
  },
} as const

// Flag to prevent multiple refresh token requests
let isRefreshing = false
// Store pending requests
let failedQueue: any[] = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Function to refresh token
const refreshToken = async () => {
  try {
    const secretKey = process.env.EXPO_PUBLIC_CORE_SECRET_TOKEN
    if (!secretKey) {
      throw new Error('Secret token not found in environment variables')
    }

    const response = await coreApi.post(ENDPOINTS.AUTH.TOKEN, {
      secret_key: secretKey,
    })

    const token = response.data.token

    if (typeof token !== 'string') {
      throw new Error('Access token must be a string')
    }

    await setItemAsync('coreAccessToken', token)
    return token
  } catch (error) {
    await setItemAsync('coreAccessToken', '') // Clear token on error
    console.error('Token refresh error:', error)
    throw error
  }
}

// Add authentication and token refresh interceptor
coreApi.interceptors.request.use(
  async (config) => {
    const coreAccessToken = await getItemAsync('coreAccessToken')
    if (coreAccessToken && typeof coreAccessToken === 'string') {
      config.headers.Authorization = `Bearer ${coreAccessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    )
  }
)

// Add token refresh interceptor
coreApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // Handle 401 error
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => coreApi(originalRequest))
          .catch(() => Promise.reject(new Error('Failed to refresh token')))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshToken()
        processQueue()

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        return coreApi(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        return Promise.reject(new Error('Failed to refresh token'))
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default coreApi
