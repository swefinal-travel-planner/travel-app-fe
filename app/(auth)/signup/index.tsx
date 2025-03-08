import { useRouter, Link } from "expo-router";
import {
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import TextField from "@/components/input/TextField";
import PasswordField from "@/components/input/PasswordField";
import Pressable from "@/components/Pressable";

import styles from "../styles";
import PressableOpacity from "@/components/PressableOpacity";

export default function SignUp() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/signup/otp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.other]}>
        <Text style={styles.title}>Hi!</Text>
        <Text style={styles.subtitle}>
          Let us make trip planning fast and easy.
        </Text>

        <TextField
          placeholder="Full name"
          leftIcon="person-outline"
          type="name"
        />
        <TextField placeholder="Email" leftIcon="mail-outline" type="email" />
        <PasswordField placeholder="Password" leftIcon="key-outline" />
        <PasswordField placeholder="Repeat password" leftIcon="key-outline" />

        <Pressable
          title="Sign up"
          variant="primary"
          onPress={handlePress}
          style={{ marginVertical: 20 }}
        />

        <Text style={[styles.text, { alignSelf: "center", marginBottom: 8 }]}>
          or continue with
        </Text>
        <View style={styles.socials}>
          <PressableOpacity>
            <Image
              source={require("@/assets/images/facebook.png")}
              style={styles.socialIcon}
            />
          </PressableOpacity>
          <PressableOpacity>
            <Image
              source={require("@/assets/images/google.png")}
              style={styles.socialIcon}
            />
          </PressableOpacity>
        </View>

        <View style={[styles.span, { marginTop: 20 }]}>
          <Text style={styles.text}>Already have an account?</Text>
          <Link style={styles.link} dismissTo href="/login">
            Log in
          </Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
