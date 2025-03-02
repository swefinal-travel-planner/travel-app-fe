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

export default function Login() {
  const router = useRouter();

  const handlePress = () => {
    router.replace("/(tabs)");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.login]}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          Log in to get back to trip planning with us.
        </Text>
        <TextField placeholder="Email" leftIcon="mail-outline" type="email" />
        <PasswordField placeholder="Password" leftIcon="key-outline" />
        <Link
          style={[styles.link, { alignSelf: "flex-end", marginTop: -8 }]}
          dismissTo
          href="/forgot"
        >
          Forgot password
        </Link>
        <Pressable
          title="Log in"
          onPress={handlePress}
          variant="primary"
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
          <Text style={styles.text}>Don't have an account?</Text>
          <Link style={styles.link} dismissTo href="/signup">
            Sign up
          </Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
