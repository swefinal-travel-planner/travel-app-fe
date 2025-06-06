import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getItemAsync, setItemAsync } from 'expo-secure-store'

// Extended type for request config with _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const BASE_URL = process.env.EXPO_PUBLIC_CORE_API_URL ?? ''

// Core API for all requests
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

// Function to create endpoint URL
export const createEndpoint = (path: string) => `${BASE_URL}${path}`

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

// Log request before sending
api.interceptors.request.use(
  async (config) => {
    try {
      const coreAccessToken = await getItemAsync('coreAccessToken')

      if (coreAccessToken && typeof coreAccessToken === 'string') {
        config.headers.Authorization = `Bearer ${coreAccessToken}`
      }

      console.log(
        '\nSending Request:\n',
        JSON.stringify(
          {
            url: config.url,
            method: config.method,
            params: config.params,
            data: config.data,
            headers: config.headers,
          },
          null,
          2
        )
      )

      return config
    } catch (error) {
      console.error(
        'Request interceptor error:',
        JSON.stringify(error, null, 2)
      )
      return config
    }
  },
  (error) => {
    console.error('Request Error:', JSON.stringify(error, null, 2))
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    )
  }
)

// Function to refresh token
const refreshToken = async () => {
  try {
    const secretKey = process.env.EXPO_PUBLIC_CORE_SECRET_TOKEN
    if (!secretKey) {
      throw new Error('Secret token not found in environment variables')
    }

    const response = await axios.post(ENDPOINTS.AUTH.TOKEN, {
      secret_key: secretKey,
    })

    const token = response.data.token

    // Ensure we're storing a string
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

// Add response interceptor to handle 204 and 401 responses
api.interceptors.response.use(
  (response) => {
    console.log(
      '\nResponse received:\n',
      JSON.stringify(
        {
          status: response.status,
          data: response.data,
          headers: response.headers,
        },
        null,
        2
      )
    )
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // If the error has a response and it's a 204, treat it as success
    if (error.response?.status === 204) {
      console.log('\nReceived 204 No Content - treating as success')
      return Promise.resolve({ status: 204, data: null })
    }

    // Handle 401 error
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If token refresh is in progress, queue the failed request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            console.error(
              '\nToken refresh error:\n',
              JSON.stringify(err, null, 2)
            )
            return Promise.reject(new Error('Failed to refresh token'))
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshToken()
        processQueue()

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        return api(originalRequest)
      } catch (refreshError) {
        console.error(
          '\nToken refresh error:\n',
          JSON.stringify(refreshError, null, 2)
        )
        processQueue(refreshError)
        return Promise.reject(new Error('Failed to refresh token'))
      } finally {
        isRefreshing = false
      }
    }

    console.error(
      '\nResponse Error:\n',
      JSON.stringify(
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
            headers: error.config?.headers,
          },
        },
        null,
        2
      )
    )

    return Promise.reject(error)
  }
)

export default api
