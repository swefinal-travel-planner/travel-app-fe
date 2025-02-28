import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function ToolsIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tools/exchange"); // Redirect to exchange
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#563D30" />
    </View>
  );
}
