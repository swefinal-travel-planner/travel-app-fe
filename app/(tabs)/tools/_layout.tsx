import { useGlobalStyles } from "@/styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ToolLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const styles = useGlobalStyles();

  useEffect(() => {
    router.replace("/(tabs)/tools/currency-converter");
  }, []);

  return (
    <View style={styles.safeAreaContainer}>
      {/* Tools Top Tabs with Icons Only */}
      <View style={localStyles.floatingTabContainer}>
        <TabButton
          icon="cloud"
          active={pathname.includes("weather") || pathname.includes("forecast")}
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
      <Stack screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}>
        <Stack.Screen name="weather" />
        <Stack.Screen name="currency-converter" />
        <Stack.Screen name="translate" />
        <Stack.Screen name="forecast" />
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
      style={[active ? localStyles.activeTab : localStyles.tabButton]}
    >
      <Ionicons name={icon} size={15} color={"#563d30"} />
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingTabContainer: {
    flexDirection: "row",
    padding: 6,
    borderRadius: 100,
    backgroundColor: "#e5dacb",
    justifyContent: "center",
    position: "absolute",
    top: 20,
    alignSelf: "center",
    zIndex: 10,
  },
  tabButton: {
    padding: 15,
    borderRadius: 100,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 100,
    alignItems: "center",
  },
});
