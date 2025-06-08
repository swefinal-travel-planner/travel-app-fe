import { INDENT_LEVEL } from '@/constants/utilConstants'
import axios from 'axios'

// Create base axios instance with common configuration
const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
  })

  // Request interceptor with logging
  instance.interceptors.request.use(
    async (config) => {
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
          INDENT_LEVEL
        )
      )
      return config
    },
    (error) => {
      console.error('Request Error:', JSON.stringify(error, null, INDENT_LEVEL))
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error))
      )
    }
  )

  // Response interceptor with logging
  instance.interceptors.response.use(
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
          INDENT_LEVEL
        )
      )
      return response
    },
    (error) => {
      // Handle 204 responses
      if (error.response?.status === 204) {
        console.log('\nReceived 204 No Content - treating as success')
        return Promise.resolve({ status: 204, data: null })
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
          INDENT_LEVEL
        )
      )
      return Promise.reject(error)
    }
  )

  return instance
}

export default createAxiosInstance
