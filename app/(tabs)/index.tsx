import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home screen</Text>
            <Link href="/signup" style={styles.button}>
                Go to signup screen
            </Link>
        </View>
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
        fontSize: 20,
    },
    button: {
        fontSize: 20,
        fontFamily: "NotoSerif_400Regular",
        textDecorationLine: "underline",
        color: "#563D30",
    },
});
