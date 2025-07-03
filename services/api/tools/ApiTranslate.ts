import { TranslateResponse } from '@/types/Translate/TranslateResponse'
import beApi from '../../../lib/beApi'
import createAxiosInstance from '@/lib/axios'

const url = process.env.EXPO_PUBLIC_TRANSLATE_API_URL ?? ''
const key = process.env.EXPO_PUBLIC_TRANSLATE_API_KEY

const api = createAxiosInstance(url)

export async function ApiTranslate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    const response = await api.post(
      url,
      {
        prompt: `Translate the following ${sourceLanguage} text into ${targetLanguage}.`,
        text: text,
        tool: 'translate',
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      }
    )

    const data = response.data as TranslateResponse

    return data.result[0].text || '' // Assuming the API returns an array of translations
  } catch (error) {
    console.error('Error fetching translation data:', error)
    throw error
  }
}
