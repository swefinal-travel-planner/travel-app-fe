import { useRouter, Link } from "expo-router";
import {
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { GoogleAuthProvider } from "firebase/auth";
// @ts-ignore
import { signInWithRedirect } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import type { UserCredential } from "firebase/auth";
import type { FirebaseError } from "firebase/app";

import TextField from "@/components/input/TextField";
import PasswordField from "@/components/input/PasswordField";
import Pressable from "@/components/Pressable";
import PressableOpacity from "@/components/PressableOpacity";

import styles from "../styles";

interface LoginFormData {
  email: string;
  password: string;
}

interface GoogleSignInResult extends UserCredential {}
interface GoogleSignInError extends FirebaseError {}

// form validation schema
const schema = z.object({
  email: z
    .string({ required_error: "Please enter your email address" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Please enter your password" })
    .min(8, { message: "Password must have at least 8 characters" }),
});

export default function Login() {
  const router = useRouter();

  // initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const errorMessage = errors.email?.message || errors.password?.message;

  // auth provider
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    signInWithRedirect(auth, googleProvider)
      .then((result: GoogleSignInResult) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential ? credential.accessToken : undefined;

        const user = result.user;
        // const userInfo = getAdditionalUserInfo(result);

        console.log(user);
      })
      .catch((error: GoogleSignInError) => {
        const errorCode: string = error.code;
        const errorMessage: string = error.message;

        console.log(errorCode, errorMessage);
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const onSubmit = (data: LoginFormData): void => {
    router.replace("/(tabs)");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.login]}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          Log in to get back to trip planning with us.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              onBlur={onBlur}
              leftIcon="mail-outline"
              type="email"
              onChange={onChange}
              value={value}
              placeholder="Email"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField
              onBlur={onBlur}
              leftIcon="key-outline"
              onChange={onChange}
              value={value}
              placeholder="Password"
            />
          )}
        />

        <Link
          style={[styles.link, { alignSelf: "flex-end", marginTop: -8 }]}
          dismissTo
          href="/forgot"
        >
          Forgot password
        </Link>

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable
          title="Log in"
          onPress={handleSubmit(onSubmit)}
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

          <PressableOpacity onPress={handleGoogleLogin}>
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
