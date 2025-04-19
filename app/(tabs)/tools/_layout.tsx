import { IconSize, Padding, Radius } from "@/constants/theme";
import { useThemeStyle } from "@/hooks/useThemeStyle";
import { colorPalettes } from "@/styles/Itheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ToolLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const theme = useThemeStyle();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    router.replace("/(tabs)/tools/currency-converter");
  }, []);

  return (
    <View style={styles.safeAreaContainer}>
      {/* Tools Top Tabs with Icons Only */}
      <View style={styles.floatingTabContainer}>
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
  const theme = useThemeStyle();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[active ? styles.activeTab : styles.tabButton]}
    >
      <Ionicons name={icon} size={IconSize.XS} color={"#563d30"} />
    </TouchableOpacity>
  );
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      padding: Padding.NORMAL,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
    },
    floatingTabContainer: {
      flexDirection: "row",
      padding: Padding.NORMAL,
      borderRadius: Radius.FULL,
      backgroundColor: theme.primary,
      justifyContent: "center",
      position: "absolute",
      top: 20,
      alignSelf: "center",
      zIndex: 10,
    },
    tabButton: {
      padding: 15,
      borderRadius: Radius.NORMAL,
      alignItems: "center",
      backgroundColor: "transparent",
    },
    activeTab: {
      backgroundColor: theme.text,
      padding: 15,
      borderRadius: 100,
      alignItems: "center",
    },
  });
