import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import { z } from 'zod'

import { usePwdResetStore } from '@/store/usePwdResetStore'

import beApi, { BE_URL } from '@/lib/beApi'
import axios from 'axios'

import CustomTextField from '@/components/input/CustomTextField'
import Pressable from '@/components/Pressable'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useMemo } from 'react'
import { createStyles } from '../styles'

interface ForgotFormData {
  email: string
}

// form validation schema
const schema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address' })
    .email({ message: 'Invalid email address' }),
})

export default function ForgotPassword() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const setEmail = usePwdResetStore((state) => state.setEmail)

  // initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: ForgotFormData): Promise<void> => {
    try {
      // set the email in the store
      setEmail(data.email)

      await beApi.post(`${BE_URL}/auth/reset-password/send-otp`, {
        email: data.email,
      })

      router.push('/forgot/otp')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error('API error:', error.response?.data || error.message)
      } else {
        console.error('Password reset email error:', error)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>Enter your email to get started.</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomTextField
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
          style={{ ...styles.primaryButton, marginVertical: 20 }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}
