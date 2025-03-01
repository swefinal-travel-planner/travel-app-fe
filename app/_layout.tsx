import {
  NotoSerif_400Regular,
  NotoSerif_700Bold,
  useFonts,
} from "@expo-google-fonts/noto-serif";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

// prevent the splash screen from hiding before the font finishes loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NotoSerif_400Regular,
    NotoSerif_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}
