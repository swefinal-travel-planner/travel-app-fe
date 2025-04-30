interface Forecast {
  forecastday: ForecastDay[]
}

interface ForecastDay {
  date: string
  day: CurrentWeather
  hour: CurrentWeather[]
}
