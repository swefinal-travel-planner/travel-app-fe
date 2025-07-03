import { colorPalettes } from '@/constants/Itheme'
import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { ApiGetWeather } from '@/services/api/tools/ApiWeather'
import { WeatherResponse } from '@/types/Weather/WeatherResponse'
import { formatDayInWeek } from '@/utils/Datetime'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function Forecast() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const {
    data: weatherData,
    isLoading,
    error,
  } = useQuery<WeatherResponse>({
    queryKey: ['weather', 'Ho_Chi_Minh', 5, 'yes'],
    queryFn: ApiGetWeather,
  })

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading weather forecast...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={64} color="#666" />
          <Text style={styles.errorTitle}>Unable to load forecast</Text>
          <Text style={styles.errorText}>Please check your connection and try again</Text>
        </View>
      </SafeAreaView>
    )
  }

  const currentDay = weatherData?.forecast?.forecastday[0]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Weather Forecast</Text>
          <Text style={styles.subtitle}>Ho Chi Minh City, Vietnam</Text>
        </View>

        {/* Current Weather Card */}
        {currentDay && (
          <View style={styles.currentWeatherCard}>
            <View style={styles.currentWeatherHeader}>
              <View>
                <Text style={styles.currentTemp}>{Math.round(currentDay.day.avgtemp_c)}°C</Text>
                <Text style={styles.currentCondition}>{currentDay.day.condition.text}</Text>
              </View>
              <Image source={{ uri: `https:${currentDay.day.condition.icon}` }} style={styles.currentWeatherIcon} />
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Ionicons name="water-outline" size={20} color={theme.primary} />
                <Text style={styles.detailText}>{currentDay.day.daily_chance_of_rain}%</Text>
                <Text style={styles.detailLabel}>Rain</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Ionicons name="thermometer-outline" size={20} color={theme.primary} />
                <Text style={styles.detailText}>{Math.round(currentDay.day.temp_c)}°C</Text>
                <Text style={styles.detailLabel}>Current</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Ionicons name="thermometer-outline" size={20} color={theme.primary} />
                <Text style={styles.detailText}>{Math.round(currentDay.day.feelslike_c)}°C</Text>
                <Text style={styles.detailLabel}>Feels Like</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Ionicons name="speedometer-outline" size={20} color={theme.primary} />
                <Text style={styles.detailText}>{Math.round(currentDay.day.humidity)}%</Text>
                <Text style={styles.detailLabel}>Humidity</Text>
              </View>
            </View>
          </View>
        )}

        {/* 5-Day Forecast */}
        <View style={styles.forecastContainer}>
          <Text style={styles.sectionTitle}>5-Day Forecast</Text>
          {weatherData?.forecast?.forecastday.map((day, index) => (
            <View key={day.date} style={styles.forecastItem}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayText}>{index === 0 ? 'Today' : formatDayInWeek(day.date)}</Text>
                <Text style={styles.dateText}>
                  {new Date(day.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <View style={styles.weatherInfo}>
                <Image source={{ uri: `https:${day.day.condition.icon}` }} style={styles.weatherIcon} />
                <Text style={styles.conditionText} numberOfLines={2}>
                  {day.day.condition.text}
                </Text>
              </View>

              <View style={styles.temperatureInfo}>
                <Text style={styles.maxTemp}>{Math.round(day.day.temp_c)}°</Text>
                <Text style={styles.minTemp}>{Math.round(day.day.feelslike_c)}°</Text>
              </View>

              <View style={styles.rainInfo}>
                <Ionicons name="water-outline" size={16} color={theme.primary} />
                <Text style={styles.rainText}>{day.day.daily_chance_of_rain}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          {currentDay && (
            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="eye-outline" size={20} color={theme.primary} />
                <Text style={styles.infoLabel}>Visibility</Text>
                <Text style={styles.infoValue}>{currentDay.day.vis_km} km</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="speedometer-outline" size={20} color={theme.primary} />
                <Text style={styles.infoLabel}>UV Index</Text>
                <Text style={styles.infoValue}>{currentDay.day.uv}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="airplane-outline" size={20} color={theme.primary} />
                <Text style={styles.infoLabel}>Wind Speed</Text>
                <Text style={styles.infoValue}>{Math.round(currentDay.day.wind_kph)} km/h</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingTop: 110,
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
      paddingBottom: 20,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    title: {
      fontSize: FontSize.XXL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
    },
    currentWeatherCard: {
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
    currentWeatherHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    currentTemp: {
      fontSize: 48,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    currentCondition: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginTop: 4,
    },
    currentWeatherIcon: {
      width: 80,
      height: 80,
    },
    weatherDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    weatherDetail: {
      alignItems: 'center',
      flex: 1,
    },
    detailText: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginTop: 4,
    },
    detailLabel: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginTop: 2,
    },
    forecastContainer: {
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
    sectionTitle: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 16,
    },
    forecastItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    dayInfo: {
      width: 80,
    },
    dayText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    dateText: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      marginTop: 2,
    },
    weatherInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16,
    },
    weatherIcon: {
      width: 40,
      height: 40,
      marginRight: 12,
    },
    conditionText: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      flex: 1,
    },
    temperatureInfo: {
      alignItems: 'flex-end',
      marginRight: 16,
    },
    maxTemp: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    minTemp: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
    },
    rainInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 50,
    },
    rainText: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: theme.primary,
      marginLeft: 4,
    },
    additionalInfoContainer: {
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
    additionalInfo: {
      gap: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    infoLabel: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      flex: 1,
      marginLeft: 12,
    },
    infoValue: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
  })
