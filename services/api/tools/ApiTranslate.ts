import { TranslateResponse } from '@/types/Translate/TranslateResponse'
import beApi from '../../../lib/beApi'

const url = process.env.EXPO_PUBLIC_TRANSLATE_API_URL ?? ''
const key = process.env.EXPO_PUBLIC_TRANSLATE_API_KEY

export async function ApiTranslate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  try {
    const response = await beApi.post(
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
