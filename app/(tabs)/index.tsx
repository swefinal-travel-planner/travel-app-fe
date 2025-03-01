import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import styles from "../styles";

export default function Index() {
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" />
      <Text style={styles.mainText}>Home screen</Text>
      <Link href="/signup" style={styles.mainButton}>
        Go to Signup screen
      </Link>
    </View>
  );
}
