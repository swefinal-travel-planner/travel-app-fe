import { QueryFunctionContext } from '@tanstack/react-query'
import api from '../api'
import { WeatherResponse } from '@/types/Weather/WeatherResponse'

const url = process.env.EXPO_PUBLIC_WEATHER_API_URL
const key = process.env.EXPO_PUBLIC_WEATHER_API_KEY

export const ApiGetWeather = async ({
  queryKey,
}: QueryFunctionContext<readonly unknown[]>): Promise<WeatherResponse> => {
  const [, city, numberOfDays, aqi] = queryKey as [
    string,
    string,
    number,
    string,
  ]

  try {
    const response = await api.get(
      `${url}?key=${key}&q=${city}&days=${numberOfDays}&aqi=${aqi}`
    )

    return response.data as WeatherResponse
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw new Error('Failed to fetch weather data')
  }
}
