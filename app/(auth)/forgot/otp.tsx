import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Text, View, Keyboard, TouchableWithoutFeedback } from "react-native";

import OtpField from "@/components/input/OtpField";
import Pressable from "@/components/Pressable";

import styles from "../styles";

export default function ForgotPasswordOtp() {
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);

  const router = useRouter();

  const handlePress = () => {
    router.replace("/forgot/reset");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCountdown(60);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendDisabled]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.login]}>
        <Text style={styles.title}>Verify email</Text>
        <Text style={styles.subtitle}>
          A verification code was sent to your email address. Please check your
          inbox.
        </Text>

        <OtpField />

        <Pressable
          title="Verify"
          variant="primary"
          onPress={handlePress}
          style={{ marginTop: 36 }}
        />

        <Pressable
          title={
            resendDisabled
              ? `Send another code in ${countdown} seconds`
              : "Send another code"
          }
          variant={resendDisabled ? "disabled" : "secondary"}
          disabled={resendDisabled}
          onPress={() => setResendDisabled(true)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
