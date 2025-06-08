import beApi from '../../../lib/beApi'

const url = process.env.EXPO_PUBLIC_CURRENCY_API_URL

export async function apiGetCurrencies(
  originCurrency: string,
  convertedCurrency: string
): Promise<number> {
  try {
    const response = await beApi.get(`${url}/${originCurrency}.json`)
    return response.data[originCurrency][convertedCurrency] || 0
  } catch (error) {
    console.error('Error fetching currency data:', error)
    throw error
  }
}
