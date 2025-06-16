import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'

import { useSignupStore } from '@/store/useSignupStore'

import beApi, { BE_URL } from '@/lib/beApi'
import axios from 'axios'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import { createStyles } from '../styles'

import OtpField from '@/components/input/OtpField'
import Pressable from '@/components/Pressable'

export default function SignUpOtp() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const request = useSignupStore((state) => state.request)
  const clearRequest = useSignupStore((state) => state.clearRequest)

  const [resendDisabled, setResendDisabled] = useState(true)
  const [isFilled, setIsFilled] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const router = useRouter()

  const onOtpFilled = async (otp: string) => {
    try {
      // verify the OTP
      const response = await beApi.post(`${BE_URL}/auth/register/verify-otp`, {
        email: request?.email,
        otp: otp,
      })

      // if the OTP is verified successfully, call the register API
      if (response.status === 204 || response.status === 200) {
        await beApi.post(`${BE_URL}/auth/register`, { ...request, otp: otp })
        clearRequest()
        router.replace('/signup/allergies')
      } else {
        console.error('OTP verification failed:', response)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error('API error:', error.response?.data || error.message)
        setIsFilled(false)
      } else {
        console.error('Signup OTP error:', error)
        setIsFilled(false)
      }
    }
  }

  const onOtpChanged = (otp: string) => {
    setIsFilled(otp.length === 6)
  }

  const handlePress = async () => {}

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      setCountdown(60)
    }
  }, [resendDisabled])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify signup</Text>
        <Text style={styles.subtitle}>
          A verification code was sent to your email address. Please check your
          inbox.
        </Text>

        <OtpField onChanged={onOtpChanged} onFilled={onOtpFilled} />

        <Pressable
          title="Verify"
          disabled={!isFilled}
          onPress={handlePress}
          style={styles.primaryButton}
        />

        <Pressable
          title={
            resendDisabled
              ? `Send another code in ${countdown} seconds`
              : 'Send another code'
          }
          disabled={resendDisabled}
          onPress={() => setResendDisabled(true)}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}
