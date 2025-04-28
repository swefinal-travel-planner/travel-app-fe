import axios from 'axios'

const api = axios.create({
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

// Log request before sending
api.interceptors.request.use(
  (config) => {
    console.log('Sending Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      headers: config.headers,
    })
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    )
  }
)

// Add response interceptor to handle 204 responses
api.interceptors.response.use(
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
    console.error('Response Error:', error)
    return Promise.reject(error)
  }
)

export const url =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export default api
