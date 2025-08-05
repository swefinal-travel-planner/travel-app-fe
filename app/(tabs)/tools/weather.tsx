import { colorPalettes } from '@/constants/Itheme'
import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { dayImages, nightImages } from '@/constants/weatherImages'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { ApiGetWeather } from '@/services/api/tools/ApiWeather'
import { WeatherResponse } from '@/types/Weather/WeatherResponse'
import { formatDayMonthDate, formatTimeAMPM } from '@/utils/Datetime'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Weather() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const todayFormatted = formatDayMonthDate(new Date())
  const navigation = useRouter()

  const {
    data: weatherData,
    isLoading,
    error,
  } = useQuery<WeatherResponse>({
    queryKey: ['weather', 'Ho_Chi_Minh', 7, 'yes'],
    queryFn: ApiGetWeather,
  })

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={64} color="#666" />
          <Text style={styles.errorTitle}>Unable to load weather</Text>
          <Text style={styles.errorText}>Please check your connection and try again</Text>
        </View>
      </SafeAreaView>
    )
  }

  const getImageSource = (condition: string, isDay: boolean) => {
    const formattedCondition = condition
    if (isDay) {
      return dayImages[formattedCondition as keyof typeof dayImages] || dayImages['Clear']
    } else {
      return nightImages[formattedCondition as keyof typeof nightImages] || nightImages['Clear']
    }
  }

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#4CAF50' // Good
    if (aqi <= 100) return '#FF9800' // Moderate
    if (aqi <= 150) return '#FF5722' // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#9C27B0' // Unhealthy
    if (aqi <= 300) return '#795548' // Very Unhealthy
    return '#D32F2F' // Hazardous
  }

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    if (aqi <= 200) return 'Unhealthy'
    if (aqi <= 300) return 'Very Unhealthy'
    return 'Hazardous'
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={24} color={theme.primary} />
            <Text style={styles.locationText}>{weatherData?.location.name}</Text>
          </View>
          <Text style={styles.dateText}>Today, {todayFormatted}</Text>
        </View>

        {/* Current Weather Card */}
        <View style={styles.currentWeatherCard}>
          <View style={styles.currentWeatherHeader}>
            <View style={styles.temperatureSection}>
              <Text style={styles.temperature}>{Math.round(weatherData?.current.temp_c ?? 0)}°</Text>
              <Text style={styles.condition}>{weatherData?.current.condition.text}</Text>
              <Text style={styles.feelsLike}>Feels like {Math.round(weatherData?.current.feelslike_c ?? 0)}°</Text>
            </View>
            <Image
              source={getImageSource(
                weatherData?.current.condition.text ?? 'Sunny',
                weatherData?.current.is_day ?? true
              )}
              style={styles.weatherIcon}
            />
          </View>
        </View>

        {/* Weather Details Grid */}
        <View style={styles.weatherDetailsCard}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          <View style={styles.weatherGrid}>
            <View style={styles.weatherDetail}>
              <Ionicons name="water-outline" size={24} color={theme.primary} />
              <Text style={styles.detailValue}>{Math.round(weatherData?.current.humidity ?? 0)}%</Text>
              <Text style={styles.detailLabel}>Humidity</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="speedometer-outline" size={24} color={theme.primary} />
              <Text style={styles.detailValue}>{Math.round(weatherData?.current.uv ?? 0)}</Text>
              <Text style={styles.detailLabel}>UV Index</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="airplane-outline" size={24} color={theme.primary} />
              <Text style={styles.detailValue}>{Math.round(weatherData?.current.wind_kph ?? 0)}</Text>
              <Text style={styles.detailLabel}>Wind (km/h)</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="eye-outline" size={24} color={theme.primary} />
              <Text style={styles.detailValue}>{Math.round(weatherData?.current.vis_km ?? 0)}</Text>
              <Text style={styles.detailLabel}>Visibility (km)</Text>
            </View>
          </View>
        </View>

        {/* Air Quality Card */}
        <View style={styles.airQualityCard}>
          <Text style={styles.sectionTitle}>Air Quality</Text>
          <View style={styles.aqiContainer}>
            <Text
              style={[
                styles.aqiValue,
                { color: getAQIColor(Math.round(weatherData?.current.air_quality['us-epa-index'] ?? 0)) },
              ]}
            >
              {Math.round(weatherData?.current.air_quality['us-epa-index'] ?? 0)}
            </Text>
            <Text
              style={[
                styles.aqiLabel,
                { color: getAQIColor(Math.round(weatherData?.current.air_quality['us-epa-index'] ?? 0)) },
              ]}
            >
              {getAQILabel(Math.round(weatherData?.current.air_quality['us-epa-index'] ?? 0))}
            </Text>
          </View>
        </View>

        {/* Hourly Forecast */}
        <View style={styles.hourlyForecastCard}>
          <View style={styles.forecastHeader}>
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <Pressable onPress={() => navigation.push('/(tabs)/tools/forecast')} style={styles.forecastButton}>
              <Text style={styles.forecastButtonText}>7-Day Forecast</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.primary} />
            </Pressable>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyScrollContainer}
          >
            {weatherData?.forecast.forecastday[0].hour.map((hour) => (
              <View key={hour.time_epoch} style={styles.hourlyItem}>
                <Text style={styles.hourText}>{formatTimeAMPM(hour.time)}</Text>
                <Image source={{ uri: `https:${hour.condition.icon}` }} style={styles.hourlyIcon} />
                <Text style={styles.hourlyTemp}>{Math.round(hour.temp_c)}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
      paddingTop: 70,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    loadingText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      marginTop: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
      paddingHorizontal: 32,
    },
    errorTitle: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },
    errorText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      textAlign: 'center',
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    locationText: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginLeft: 8,
    },
    dateText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
    },
    currentWeatherCard: {
      backgroundColor: 'white',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: Radius.ROUNDED,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    currentWeatherHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    temperatureSection: {
      flex: 1,
    },
    temperature: {
      fontSize: 64,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      lineHeight: 70,
    },
    condition: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      marginTop: 4,
    },
    feelsLike: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginTop: 4,
    },
    weatherIcon: {
      width: 120,
      height: 120,
    },
    weatherDetailsCard: {
      backgroundColor: 'white',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: Radius.ROUNDED,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 16,
    },
    weatherGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    weatherDetail: {
      width: '48%',
      alignItems: 'center',
      paddingVertical: 16,
      backgroundColor: theme.background,
      borderRadius: Radius.NORMAL,
      marginBottom: 12,
    },
    detailValue: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginTop: 8,
    },
    detailLabel: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginTop: 4,
    },
    airQualityCard: {
      backgroundColor: 'white',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: Radius.ROUNDED,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    aqiContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    aqiValue: {
      fontSize: 48,
      fontFamily: FontFamily.BOLD,
      lineHeight: 52,
      flex: 1,
    },
    aqiLabel: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      textAlign: 'right',
      flex: 1,
    },
    hourlyForecastCard: {
      backgroundColor: 'white',
      marginHorizontal: 16,
      marginBottom: 20,
      borderRadius: Radius.ROUNDED,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    forecastHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    forecastButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
      borderRadius: Radius.FULL,
    },
    forecastButtonText: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      marginRight: 4,
    },
    hourlyScrollContainer: {
      paddingRight: 16,
    },
    hourlyItem: {
      alignItems: 'center',
      marginRight: 20,
      minWidth: 60,
    },
    hourText: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginBottom: 8,
    },
    hourlyIcon: {
      width: 40,
      height: 40,
      marginBottom: 8,
    },
    hourlyTemp: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
  })
