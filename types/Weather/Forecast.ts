import { CurrentWeather } from './CurrentWeather'

export interface Forecast {
  forecastday: ForecastDay[]
}

export interface ForecastDay {
  date: string
  day: CurrentWeather
  hour: CurrentWeather[]
}
