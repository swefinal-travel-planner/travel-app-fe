import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Text, View, Keyboard, TouchableWithoutFeedback } from "react-native";

import { useSignupStore } from "@/lib/useSignupStore";

import axios from "axios";
import api, { url } from "@/api/api";

import OtpField from "@/components/input/OtpField";
import Pressable from "@/components/Pressable";

import styles from "../styles";

export default function SignUpOtp() {
  const request = useSignupStore((state) => state.request);

  const [resendDisabled, setResendDisabled] = useState(true);
  const [isFilled, setIsFilled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const router = useRouter();

  const onOtpFilled = async (otp: string) => {
    try {
      // verify the OTP
      const response = await api.post(`${url}/auth/register/verify-otp`, {
        email: request?.email,
        otp: otp,
      });

      // if the OTP is verified successfully, call the register API
      if (response.status === 204 || response.status === 200) {
        await api.post(`${url}/auth/register`, { ...request, otp: otp });
        router.replace("/signup/allergies");
      } else {
        console.error("OTP verification failed:", response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error("API error:", error.response?.data || error.message);
        setIsFilled(false);
      } else {
        console.error("Signup OTP error:", error);
        setIsFilled(false);
      }
    }
  };

  const onOtpChanged = (otp: string) => {
    setIsFilled(otp.length === 6);
  };

  const handlePress = async () => {};

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      setCountdown(60);
    };
  }, [resendDisabled]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, styles.other]}>
        <Text style={styles.title}>Verify signup</Text>
        <Text style={styles.subtitle}>
          A verification code was sent to your email address. Please check your
          inbox.
        </Text>

        <OtpField onChanged={onOtpChanged} onFilled={onOtpFilled} />

        <Pressable
          title="Verify"
          variant={isFilled ? "primary" : "disabled"}
          disabled={!isFilled}
          onPress={handlePress}
          style={{ marginTop: 36 }}
        />

        <Pressable
          title={
            resendDisabled
              ? `Send another code in ${countdown} seconds`
              : "Send another code"
          }
          variant={resendDisabled ? "otpDisabled" : "secondary"}
          disabled={resendDisabled}
          onPress={() => setResendDisabled(true)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
