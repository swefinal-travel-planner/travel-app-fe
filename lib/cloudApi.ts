import createAxiosInstance from '@/lib/axios'
import { EMPTY_STRING } from '@/constants/utilConstants'

const CLOUD_URL = process.env.EXPO_PUBLIC_CLOUD_API_URL ?? EMPTY_STRING

const cloudApi = createAxiosInstance(CLOUD_URL)

export default cloudApi
