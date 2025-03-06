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

import TextField from "@/components/input/TextField";
import PasswordField from "@/components/input/PasswordField";
import Pressable from "@/components/Pressable";

import styles from "../styles";
import PressableOpacity from "@/components/PressableOpacity";

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

  const onSubmit = (data: SignupFormData): void => {
    router.push("/signup/otp");
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
