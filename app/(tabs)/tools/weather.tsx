import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Tool1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
