import {
  NotoSerif_400Regular,
  NotoSerif_700Bold,
  useFonts,
} from "@expo-google-fonts/noto-serif";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// prevent the splash screen from hiding before the font finishes loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NotoSerif_400Regular,
    NotoSerif_700Bold,
  });

  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      GoogleSignin.configure({
        webClientId:
          "490333496504-qe9p6s4an7ub4ros021q2p6kda9hakhm.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      });
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
