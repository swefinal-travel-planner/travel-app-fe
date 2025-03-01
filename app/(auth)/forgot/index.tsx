import { useRouter } from "expo-router";
import { Text, View, Keyboard, TouchableWithoutFeedback } from "react-native";

import TextField from "@/components/input/TextField";
import Pressable from "@/components/Pressable";

import styles from "../styles";

export default function ForgotPassword() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/forgot/otp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.login]}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>Enter your email to get started.</Text>
        <TextField placeholder="Email" leftIcon="mail-outline" type="email" />

        <Pressable
          title="Next"
          onPress={handlePress}
          variant="primary"
          style={{ marginVertical: 20 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
