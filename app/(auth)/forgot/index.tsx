import { useRouter } from 'expo-router'
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { usePwdResetStore } from '@/lib/usePwdResetStore'

import api, { url } from '@/services/api/api'
import axios from 'axios'

import CustomTextField from '@/components/input/CustomTextField'
import Pressable from '@/components/Pressable'

import styles from '../styles'

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

      await api.post(`${url}/auth/reset-password/send-otp`, {
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
      <View style={[styles.container, styles.login]}>
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
          variant="primary"
          style={{ marginVertical: 20 }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}
