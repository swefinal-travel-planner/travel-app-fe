import { WeatherResponse } from '@/types/Weather/WeatherResponse'
import { QueryFunctionContext } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import beApi from '../../../lib/beApi'
import Constants from 'expo-constants'

const url = process.env.EXPO_PUBLIC_WEATHER_API_URL
const key = Constants.expoConfig?.extra?.weatherApiKey

export const ApiGetWeather = async ({
  queryKey,
}: QueryFunctionContext<readonly unknown[]>): Promise<WeatherResponse> => {
  const [, city, numberOfDays, aqi] = queryKey as [string, string, number, string]

  try {
    const response = await beApi.get(`${url}?key=${key}&q=${city}&days=${numberOfDays}&aqi=${aqi}`)

    return response.data as WeatherResponse
  } catch (error) {
    console.error('Error fetching weather data:', error instanceof AxiosError ? error.response : error)
    throw new Error('Failed to fetch weather data')
  }
}
