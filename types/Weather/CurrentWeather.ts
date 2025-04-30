interface CurrentWeather {
  time_epoch: number
  time: string
  last_updated_epoch: number
  last_updated: string
  temp_c: number
  is_day: boolean
  condition: WeatherCondition
  wind_mph: number
  wind_kph: number
  wind_degree: number
  wind_dir: string
  humidity: number
  cloud: number
  feelslike_c: number
  windchill_c: number
  heatindex_c: number
  dewpoint_c: number
  vis_km: number
  vis_miles: number
  uv: number
  gust_mph: number
  gust_kph: number
  air_quality: AirQuality
  avgtemp_c: number
  daily_chance_of_rain: number
}

interface WeatherCondition {
  text: string
  icon: string
  code: number
}
