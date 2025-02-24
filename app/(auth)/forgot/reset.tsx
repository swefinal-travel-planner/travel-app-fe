import { useRouter, Link } from "expo-router";
import { Text, View, Keyboard, TouchableWithoutFeedback, Image } from "react-native";

import TextField from "@/components/input/TextField";
import PasswordField from "@/components/input/PasswordField";
import Pressable from "@/components/Pressable";

import styles from "../styles";

export default function ResetPassword() {
    const router = useRouter();

    const handlePress = () => {
        router.replace("/login");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, styles.login]}>
                <Text style={styles.title}>Reset your password</Text>
                <Text style={styles.subtitle}>Enter your new password.</Text>
                <PasswordField placeholder="Password" leftIcon="key-outline" />
                <PasswordField placeholder="Repeat password" leftIcon="key-outline" />

                <Pressable
                    title="Confirm"
                    onPress={handlePress}
                    variant="primary"
                    style={{ marginVertical: 20 }}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}
