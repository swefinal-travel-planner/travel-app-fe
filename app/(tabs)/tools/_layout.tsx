import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ToolLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.replace("/(tabs)/tools/currency-converter");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Tools Top Tabs with Icons Only */}
      <View style={styles.tabContainer}>
        <TabButton
          icon="cloud"
          active={pathname.includes("weather")}
          onPress={() => router.push("/(tabs)/tools/weather")}
        />
        <TabButton
          icon="cash"
          active={pathname.includes("currency-converter")}
          onPress={() => router.push("/(tabs)/tools/currency-converter")}
        />
        <TabButton
          icon="language"
          active={pathname.includes("translate")}
          onPress={() => router.push("/(tabs)/tools/translate")}
        />
      </View>

      {/* Nested Stack Navigator */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="weather" />
        <Stack.Screen name="currency-converter" />
        <Stack.Screen name="translate" />
      </Stack>
    </View>
  );
}

// Reusable Tab Button Component (Icon Only)
function TabButton({
  icon,
  onPress,
  active,
}: Readonly<{
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active: boolean;
}>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[active ? styles.activeTab : styles.tabButton]}
    >
      <Ionicons name={icon} size={24} color={active ? "white" : "#563d30"} />
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 7,
    borderRadius: 100,
    width: "70%",
    alignSelf: "center",
    overflow: "hidden",
    marginVertical: 20,
    backgroundColor: "#e5dacb",
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#563d30", // Highlight color for active tab
    flex: 1,
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
  },
});
