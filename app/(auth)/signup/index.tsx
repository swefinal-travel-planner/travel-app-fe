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

import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import axios from "axios";
import api from "@/api/api";

import TextField from "@/components/input/TextField";
import PasswordField from "@/components/input/PasswordField";
import Pressable from "@/components/Pressable";

import styles from "../styles";
import PressableOpacity from "@/components/PressableOpacity";

// API url
const url = process.env.EXPO_PUBLIC_API_URL;

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

// form validation schema
const schema = z
  .object({
    name: z
      .string({ required_error: "Please enter your name" })
      .min(2, { message: "Your name must be at least 2 characters long" }),
    email: z
      .string({ required_error: "Please enter your email address" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Please enter your password" })
      .min(8, { message: "Password must have at least 8 characters" }),
    repPassword: z.string({ required_error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.repPassword, {
    message: "Passwords do not match",
    path: ["repPassword"],
  });

export default function SignUp() {
  const router = useRouter();

  // initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const errorMessage =
    errors.name?.message ||
    errors.email?.message ||
    errors.password?.message ||
    errors.repPassword?.message;

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo && userInfo.data?.idToken) {
        const googleCredential = GoogleAuthProvider.credential(
          userInfo.data.idToken,
        );

        const firebaseUserCredential = await signInWithCredential(
          auth,
          googleCredential,
        );

        const user = firebaseUserCredential.user;

        const payload = {
          displayName: user.displayName || "",
          email: user.email || "",
          password: "googlelogin", // placeholder since password is not applicable for Google login
          phoneNumber: user.phoneNumber || "",
          photoURL: user.photoURL || "",
          uid: user.uid,
        };

        console.log("Google login payload:", payload);

        await api.post(`${url}/api/v1/auth/google-login`, payload);
        console.log("yay");

        router.replace("/(tabs)");
      } else {
        console.log("Google sign-in cancelled or ID token missing");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error("API error:", error.response?.data || error.message);
      } else if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
            console.error("Google sign-in error:", error);
        }
      } else {
        console.error("Google sign-in error:", error);
      }
    }
  };

  // handle regular signup
  const onSubmit = async (data: SignupFormData) => {
    try {
      const payload = {
        email: data.email || "",
        name: data.name || "",
        password: data.password || "",
      };

      await api.post(`${url}/api/v1/auth/register`, payload);

      router.replace("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error("API error:", error.response?.data || error.message);
      } else {
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.other]}>
        <Text style={styles.title}>Hi!</Text>
        <Text style={styles.subtitle}>
          Let us make trip planning fast and easy.
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              onBlur={onBlur}
              leftIcon="person-outline"
              type="name"
              onChange={onChange}
              value={value}
              placeholder="Full name"
            />
          )}
        />

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

        <Controller
          control={control}
          name="repPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField
              onBlur={onBlur}
              leftIcon="key-outline"
              onChange={onChange}
              value={value}
              placeholder="Confirm password"
            />
          )}
        />

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable
          title="Sign up"
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        />

        <Text style={[styles.text, { alignSelf: "center", marginBottom: 8 }]}>
          or continue with
        </Text>

        <View style={styles.socials}>
          <PressableOpacity onPress={handleGoogleLogin}>
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
