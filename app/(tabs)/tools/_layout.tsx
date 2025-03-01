import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ToolLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.replace("/(tabs)/tools/exchange");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Custom Top Tabs */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Weather"
          active={pathname.includes("weather")}
          onPress={() => router.push("/(tabs)/tools/weather")}
        />
        <TabButton
          title="Exchange"
          active={pathname.includes("exchange")}
          onPress={() => router.push("/(tabs)/tools/exchange")}
        />
        <TabButton
          title="Translate"
          active={pathname.includes("translate")}
          onPress={() => router.push("/(tabs)/tools/translate")}
        />
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="weather" />
        <Stack.Screen name="exchange" />
        <Stack.Screen name="translate" />
      </Stack>
    </View>
  );
}

// Reusable Tab Button Component
function TabButton({
  title,
  onPress,
  active,
}: Readonly<{ title: string; onPress: () => void; active: boolean }>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabButton, active && styles.activeTab]}
    >
      <Text style={[styles.tabText, active && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
    backgroundColor: "#eee",
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#007AFF", // Highlight color
  },
  tabText: {
    fontSize: 16,
    color: "black",
  },
  activeText: {
    color: "white", // Highlighted text color
    fontWeight: "bold",
  },
});
