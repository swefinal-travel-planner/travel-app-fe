import { useRouter } from "expo-router";
import { Text, View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import TextField from "@/components/input/TextField";
import Pressable from "@/components/Pressable";

import styles from "../styles";

interface ForgotFormData {
  email: string;
}

// form validation schema
const schema = z.object({
  email: z
    .string({ required_error: "Please enter your email address" })
    .email({ message: "Invalid email address" }),
});

export default function ForgotPassword() {
  const router = useRouter();

  // initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: ForgotFormData): void => {
    router.push("/forgot/otp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.login]}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>Enter your email to get started.</Text>

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

        {errors.email?.message && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Pressable
          title="Next"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          style={{ marginVertical: 20 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
