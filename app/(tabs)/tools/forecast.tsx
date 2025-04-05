import { ApiGetWeather } from "@/api/tools/ApiWeather";
import { WeatherResponse } from "@/types/Weather/WeatherResponse";
import { formatDayInWeek } from "@/utils/Datetime";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function Forecast() {
  const {
    data: weatherData,
    isLoading,
    error,
  } = useQuery<WeatherResponse>({
    queryKey: ["weather", "Ho_Chi_Minh", 5, "yes"],
    queryFn: ApiGetWeather,
  });

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading forecast data.</Text>;

  return (
    <SafeAreaView style={styles.forecastContainer}>
      <View>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Forecast</Text>
        {weatherData?.forecast?.forecastday.map((day) => (
          <View key={day.date} style={styles.forecastItem}>
            <Text style={styles.dayText}>{formatDayInWeek(day.date)}</Text>
            <Image
              source={{ uri: `https:${day.day.condition.icon}` }}
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.forecastText}>{day.day.condition.text}</Text>
            <Text style={styles.numberText}>
              {Math.round(day.day.avgtemp_c)}°C
            </Text>
            <Text style={styles.numberText}>
              {day.day.daily_chance_of_rain}%
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  forecastContainer: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dayText: {
    width: 60, // Ensure consistent width for text elements
  },
  forecastText: {
    fontSize: moderateScale(14),
    width: 120, // Ensure consistent width for text elements
    marginLeft: 10,
    color: "#333",
  },
  forecastImage: {
    width: 40,
    height: 40,
  },
  numberText: {
    fontSize: moderateScale(14),
    color: "#333",
    width: 50, // Ensure consistent width for text elements
    textAlign: "right", // Align text to the right
  },
});
