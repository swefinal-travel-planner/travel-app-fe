import createAxiosInstance from '@/lib/axios'

export const checkApiHealth = async (api: string): Promise<boolean> => {
  try {
    const apiInstance = createAxiosInstance(api)
    const response = await apiInstance.get('/health')
    return response.status === 200
  } catch (error) {
    console.error('Error checking API health:', error)
    return false
  }
}
