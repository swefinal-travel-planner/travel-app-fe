import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import {
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { z } from 'zod'

import { auth } from '@/firebaseConfig'
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'

import { useSignupStore } from '@/lib/useSignupStore'

import api, { url } from '@/services/api/api'
import axios from 'axios'

import { useThemeStyle } from '@/hooks/useThemeStyle'
import { useMemo } from 'react'
import { createStyles } from '../styles'

import CustomTextField from '@/components/input/CustomTextField'
import PasswordField from '@/components/input/PasswordField'
import Pressable from '@/components/Pressable'
import PressableOpacity from '@/components/PressableOpacity'

import saveLoginInfo from '@/utils/saveLoginInfo'

interface SignupFormData {
  name: string
  email: string
  password: string
}

// form validation schema
const schema = z
  .object({
    name: z
      .string({ required_error: 'Please enter your name' })
      .min(2, { message: 'Your name must be at least 2 characters long' }),
    email: z
      .string({ required_error: 'Please enter your email address' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Please enter your password' })
      .min(8, { message: 'Password must have at least 8 characters' }),
    repPassword: z.string({ required_error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.repPassword, {
    message: 'Passwords do not match',
    path: ['repPassword'],
  })

export default function SignUp() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const setRequest = useSignupStore((state) => state.setRequest)

  // initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const errorMessage =
    errors.name?.message ||
    errors.email?.message ||
    errors.password?.message ||
    errors.repPassword?.message

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()

      if (userInfo && userInfo.data?.idToken) {
        const googleCredential = GoogleAuthProvider.credential(
          userInfo.data.idToken
        )

        const firebaseUserCredential = await signInWithCredential(
          auth,
          googleCredential
        )

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

        const response = await api.post(`${url}/auth/google-login`, payload)

        await saveLoginInfo(
          response.data.data.userId,
          response.data.data.accessToken,
          response.data.data.refreshToken,
          response.data.data.email,
          response.data.data.name
        )

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

  // handle regular signup
  const onSubmit = async (data: SignupFormData) => {
    try {
      const payload = {
        email: data.email || '',
        name: data.name || '',
        password: data.password || '',
      }

      // set the signup request in the store
      setRequest({ ...payload })

      await api.post(`${url}/auth/register/send-otp`, { email: payload.email })

      router.push('/signup/otp')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error('API error:', error.response?.data || error.message)
      } else {
        console.error('Signup error:', error)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Hi!</Text>
        <Text style={styles.subtitle}>
          Let us make trip planning fast and easy.
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomTextField
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
          onPress={handleSubmit(onSubmit)}
          style={styles.primaryButton}
        />

        <Text style={[styles.text, { alignSelf: 'center', marginBottom: 8 }]}>
          or continue with
        </Text>

        <View style={styles.socials}>
          <PressableOpacity onPress={handleGoogleLogin}>
            <Image
              source={require('@/assets/images/google.png')}
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
  )
}
