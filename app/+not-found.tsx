import { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not found." }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#563D30",
    fontFamily: "NotoSerif_400Regular",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#563D30",
  },
});
