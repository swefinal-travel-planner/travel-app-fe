import { Text, View, StyleSheet } from "react-native";

export default function Inbox() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Inbox screen</Text>
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
    },
});
