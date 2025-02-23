import { Link } from "expo-router";
import { Text, View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";

import CTextInput from "@/components/input/TextInput";
import PasswordInput from "@/components/input/PasswordInput";
import CButton from "@/components/Button";

export default function SignUp() {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Hi!</Text>
                <Text style={styles.text}>Let us make trip planning fast and easy.</Text>
                <CTextInput placeholder="Full name" leftIcon="person-outline" type="name" />
                <CTextInput placeholder="Email" leftIcon="mail-outline" type="email" />
                <PasswordInput placeholder="Password" leftIcon="key-outline" />
                <PasswordInput placeholder="Repeat password" leftIcon="key-outline" />
                <CButton title="Sign up" backgroundColor="#3F6453" style={{ marginTop: 20 }} />
                <Link href="/(tabs)">Go to Home screen</Link>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        paddingVertical: 80,
        paddingHorizontal: 40,
        backgroundColor: "#EEF8EF",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    title: {
        color: "#3F6453",
        fontSize: 28,
        fontFamily: "NotoSerif_700Bold",
        marginBottom: 12,
    },
    text: {
        color: "#3F6453",
        fontSize: 20,
        fontFamily: "NotoSerif_400Regular",
        marginBottom: 20,
    },
});
