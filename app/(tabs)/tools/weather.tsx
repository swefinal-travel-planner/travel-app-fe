import { ApiGetWeather } from "@/api/tools/ApiWeather";
import { dayImages, nightImages } from "@/constants/weatherImages";
import { WeatherResponse } from "@/types/Weather/WeatherResponse";
import { formatDayMonthDate, formatTimeAMPM } from "@/utils/Datetime";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Key } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { View } from "react-native-ui-lib";

export default function Weather() {
  const todayFormatted = formatDayMonthDate(new Date());
  const navigation = useRouter();

  const {
    data: weatherData,
    isLoading,
    error,
  } = useQuery<WeatherResponse>({
    queryKey: ["weather", "Ho_Chi_Minh", 7, "yes", false],
    queryFn: ApiGetWeather,
  });

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading weather data.</Text>;

  const getImageSource = (condition: string, isDay: boolean) => {
    const formattedCondition = condition;
    if (isDay) {
      return (
        dayImages[formattedCondition as keyof typeof dayImages] ||
        dayImages["Clear"]
      ); // Default to "Clear" if no match
    } else {
      return (
        nightImages[formattedCondition as keyof typeof nightImages] ||
        nightImages["Clear"]
      ); // Default to "Clear" if no match
    }
  };

  return (
    <SafeAreaView style={{ paddingTop: 70, flex: 1 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.topBar}>
          <EvilIcons name="location" size={24} color="black" />
          <Text>{weatherData?.location.name}</Text>
        </View>

        <View style={styles.overallWeather}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: moderateScale(10) }}>
              Today, {todayFormatted}
            </Text>
            <Text style={{ marginBottom: 10 }}>
              {weatherData?.current.condition.text}
            </Text>
            <Text style={{ fontSize: moderateScale(50) }}>
              {Math.round(weatherData?.current.temp_c ?? 0)}°C
            </Text>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={getImageSource(
                weatherData?.current.condition.text ?? "Sunny",
                weatherData?.current.is_day ?? true,
              )}
              style={{ width: 100, height: 100, alignContent: "center" }}
            />
          </View>
        </View>

        <View style={styles.detailWeather}>
          {/* First Row */}
          <View style={styles.row}>
            <View style={styles.box}>
              <Text style={styles.text}>
                {Math.round(weatherData?.current.humidity ?? 0)}%
              </Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>
                UV {Math.round(weatherData?.current.uv ?? 0)}°C
              </Text>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.row}>
            <View style={styles.box}>
              <Text style={styles.text}>
                Wind {Math.round(weatherData?.current.wind_kph ?? 0)} km/h
              </Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>
                AQI{" "}
                {Math.round(
                  weatherData?.current.air_quality["us-epa-index"] ?? 0,
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", marginBottom: 20 }}>
          <Pressable onPress={() => navigation.push("/(tabs)/tools/forecast")}>
            <Text style={{ color: "#007AFF", textAlign: "center" }}>
              Next 7 days forecast
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {weatherData?.forecast.forecastday[0].hour.map(
          (hour: {
            time_epoch: Key | null | undefined;
            time: string;
            condition: { icon: any };
            temp_c: any;
          }) => (
            <View key={hour.time_epoch} style={styles.forecastItem}>
              <Text>{formatTimeAMPM(hour.time)}</Text>
              <Image
                source={{ uri: `https:${hour.condition.icon}` }}
                style={{ width: 50, height: 50 }}
              />
              <Text>{Math.round(hour.temp_c ?? 0)}°C</Text>
            </View>
          ),
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  overallWeather: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  detailWeather: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, // Space between rows
  },
  box: {
    flex: 1, // Make both items take equal space
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(12),
  },
  scrollContainer: {
    flexDirection: "row", // Ensures items are laid out horizontally
    paddingLeft: 15,
  },
  forecastItem: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 10,
    marginRight: 10, // Adds spacing between items
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
});
