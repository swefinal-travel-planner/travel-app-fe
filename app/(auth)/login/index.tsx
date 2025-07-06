import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import { z } from 'zod'

import { auth } from '@/firebaseConfig'
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'

import saveLoginInfo from '@/utils/saveLoginInfo'

import beApi, { BE_URL, safeApiCall } from '@/lib/beApi'
import axios from 'axios'

import CustomTextField from '@/components/input/CustomTextField'
import PasswordField from '@/components/input/PasswordField'
import Pressable from '@/components/Pressable'
import PressableOpacity from '@/components/PressableOpacity'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import updateNotifToken from '@/utils/updateNotifToken'
import { useMemo } from 'react'
import { createStyles } from '../../../components/styles'

interface LoginFormData {
  email: string
  password: string
}

// form validation schema
const schema = z.object({
  email: z.string({ required_error: 'Please enter your email address' }).email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(8, { message: 'Password must have at least 8 characters' }),
})

export default function Login() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()

  // initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const errorMessage = errors.email?.message || errors.password?.message

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()

      if (userInfo && userInfo.data?.idToken) {
        const googleCredential = GoogleAuthProvider.credential(userInfo.data.idToken)

        const firebaseUserCredential = await signInWithCredential(auth, googleCredential)

        const user = firebaseUserCredential.user
        const idToken = await user.getIdToken()

        const payload = {
          displayName: user.displayName || '',
          email: user.email || '',
          password: 'googlelogin', // placeholder since password is not applicable for Google login
          phoneNumber: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          id_token: idToken,
        }

        const response = await safeApiCall(() => beApi.post(`${BE_URL}/auth/google-login`, payload))

        // If response is null, it means it was a silent error
        if (!response) {
          return
        }

        await saveLoginInfo(
          response.data.data.userId,
          response.data.data.accessToken,
          response.data.data.refreshToken,
          response.data.data.email,
          response.data.data.phoneNumber ?? '',
          response.data.data.photoURL || '',
          response.data.data.name
        )

        await updateNotifToken()

        router.replace('/(tabs)')
      } else {
        console.error('Google sign-in cancelled or ID token missing')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error('API error:', error.response?.data || error.message)
      } else if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break
          default:
            console.error('Google sign-in error:', error)
        }
      } else {
        console.error('Google sign-in error:', error)
      }
    }
  }

  // handle regular login
  const onSubmit = async (data: LoginFormData) => {
    try {
      const payload = {
        email: data.email || '',
        password: data.password || '',
      }

      const response = await safeApiCall(() => beApi.post(`${BE_URL}/auth/login`, payload))

      // If response is null, it means it was a silent error
      if (!response) {
        return
      }

      await saveLoginInfo(
        response.data.data.userId || 0,
        response.data.data.phoneNumber || '',
        response.data.data.accessToken || '',
        response.data.data.refreshToken || '',
        response.data.data.email || '',
        response.data.data.name || '',
        response.data.data.photoURL || ''
      )

      await updateNotifToken()

      router.replace('/(tabs)')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error('API error:', error.response?.data || error.message)
      } else {
        console.error('Login error:', error)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in to get back to trip planning with us.</Text>

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
              autoCapitalize="none"
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
              autoCapitalize="none"
            />
          )}
        />

        <Link style={[styles.link, { alignSelf: 'flex-end', marginTop: -8 }]} dismissTo href="/forgot">
          Forgot password
        </Link>

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable title="Log in" onPress={handleSubmit(onSubmit)} style={styles.primaryButton} />

        <Text style={[styles.text, { alignSelf: 'center', marginBottom: 8 }]}>or continue with</Text>

        <View style={styles.socials}>
          <PressableOpacity onPress={handleGoogleLogin}>
            <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
          </PressableOpacity>
        </View>

        <View style={[styles.span, { marginTop: 20 }]}>
          <Text style={styles.text}>Don't have an account?</Text>

          <Link style={styles.link} dismissTo href="/signup">
            Sign up
          </Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
