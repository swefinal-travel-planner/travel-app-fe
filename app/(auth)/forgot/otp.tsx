import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'

import { usePwdResetStore } from '@/lib/usePwdResetStore'

import api, { url } from '@/services/api/api'
import axios from 'axios'

import OtpField from '@/components/input/OtpField'
import Pressable from '@/components/Pressable'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import { createStyles } from '../styles'

export default function ForgotPasswordOtp() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const email = usePwdResetStore((state) => state.email)
  const setOtp = usePwdResetStore((state) => state.setOtp)

  const [resendDisabled, setResendDisabled] = useState(true)
  const [isFilled, setIsFilled] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const router = useRouter()

  const onOtpFilled = async (otp: string) => {
    try {
      setOtp(otp) // set the OTP in the store

      // verify the OTP
      await api.post(`${url}/auth/reset-password/verify-otp`, {
        email: email,
        otp: otp,
      })

      router.replace('/forgot/reset')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error('API error:', error.response?.data || error.message)
        setIsFilled(false)
      } else {
        console.error('Password reset OTP error:', error)
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
        <Text style={styles.title}>Verify email</Text>
        <Text style={styles.subtitle}>
          A verification code was sent to your email address. Please check your
          inbox.
        </Text>

        <OtpField onChanged={onOtpChanged} onFilled={onOtpFilled} />

        <Pressable
          title={
            resendDisabled
              ? `Send another code in ${countdown} seconds`
              : 'Send another code'
          }
          disabled={resendDisabled}
          onPress={() => setResendDisabled(true)}
          style={{
            marginTop: 36,
            backgroundColor: resendDisabled ? theme.primary : theme.disabled,
            color: resendDisabled ? theme.white : theme.text,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}
