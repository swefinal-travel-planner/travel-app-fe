import { CurrentWeather } from './CurrentWeather'
import { Forecast } from './Forecast'
import { WeatherLocation } from './Location'

export interface WeatherResponse {
  location: WeatherLocation
  current: CurrentWeather
  forecast: Forecast
}
