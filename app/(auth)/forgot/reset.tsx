import { useRouter } from "expo-router";
import { Text, View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordField from "@/components/input/PasswordField";
import Pressable from "@/components/Pressable";

import styles from "../styles";

interface ResetFormData {
  password: string;
  repPassword: string;
}

// form validation schema
const schema = z
  .object({
    password: z
      .string({ required_error: "Please enter your password" })
      .min(8, { message: "Password must have at least 8 characters" }),
    repPassword: z.string({ required_error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.repPassword, {
    message: "Passwords do not match",
    path: ["repPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();

  // initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const errorMessage = errors.password?.message || errors.repPassword?.message;

  const onSubmit = (data: ResetFormData): void => {
    router.replace("/login");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.login]}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>Enter your new password.</Text>

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
          title="Confirm"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          style={{ marginVertical: 20 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
