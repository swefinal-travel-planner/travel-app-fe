import createAxiosInstance from '@/lib/axios'

const CLOUD_URL = process.env.EXPO_PUBLIC_CLOUD_API_URL ?? 'https://api.cloudinary.com/v1_1'

const cloudApi = createAxiosInstance(CLOUD_URL)

export default cloudApi
