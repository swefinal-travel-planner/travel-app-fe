import { auth } from '@/firebaseConfig'
import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'
import { Image } from 'expo-image'
import { Link, useRouter } from 'expo-router'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { z } from 'zod'

import { useSignupStore } from '@/store/useSignupStore'

import beApi, { BE_URL } from '@/lib/beApi'
import axios from 'axios'

import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'

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
    email: z.string({ required_error: 'Please enter your email address' }).email({ message: 'Invalid email address' }),
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
  const [apiError, setApiError] = useState<string>('')

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
    errors.name?.message || errors.email?.message || errors.password?.message || errors.repPassword?.message || apiError

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
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          password: 'googlelogin', // placeholder since password is not applicable for Google login
          phoneNumber: user.phoneNumber ?? '',
          photoURL: user.photoURL ?? '',
          id_token: idToken,
        }

        const response = await beApi.post(`${BE_URL}/auth/google-login`, payload)

        await saveLoginInfo(
          response.data.data.userId,
          response.data.data.accessToken,
          response.data.data.refreshToken,
          response.data.data.email,
          response.data.data.name,
          response.data.data.phoneNumber ?? '',
          response.data.data.photoURL ?? ''
        )

        router.replace('/(tabs)')
      } else {
        console.error('Google sign-in cancelled or ID token missing')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle API errors from Google login
        const errorData = error.response?.data
        if (errorData?.errors && errorData.errors.length > 0) {
          setApiError(errorData.errors[0].message)
        } else {
          setApiError('Google signup failed. Please try again.')
        }
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
        setApiError('Google signup failed. Please try again.')
        console.error('Google sign-in error:', error)
      }
    }
  }

  // handle regular signup
  const onSubmit = async (data: SignupFormData) => {
    try {
      // Clear any previous API errors
      setApiError('')

      const payload = {
        email: data.email || '',
        name: data.name || '',
        password: data.password || '',
      }

      // set the signup request in the store
      setRequest({ ...payload })

      await beApi.post(`${BE_URL}/auth/register/send-otp`, {
        email: payload.email,
      })

      router.push('/signup/otp')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle axios errors (API errors)
        const errorData = error.response?.data
        if (errorData?.errors && errorData.errors.length > 0) {
          setApiError(errorData.errors[0].message)
        } else {
          setApiError('An error occurred during signup. Please try again.')
        }
        console.error('API error:', error.response?.data || error.message)
      } else {
        // Handle non-axios errors (network, etc.)
        setApiError('An unexpected error occurred. Please try again.')
        console.error('Signup error:', error)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Hi!</Text>
        <Text style={styles.subtitle}>Let us make trip planning fast and easy.</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomTextField
              onBlur={onBlur}
              leftIcon="person-outline"
              type="name"
              onChange={(text) => {
                onChange(text)
                // Clear API error when user starts typing
                if (apiError) setApiError('')
              }}
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
              onChange={(text) => {
                onChange(text)
                // Clear API error when user starts typing
                if (apiError) setApiError('')
              }}
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
              onChange={(text) => {
                onChange(text)
                // Clear API error when user starts typing
                if (apiError) setApiError('')
              }}
              value={value}
              placeholder="Password"
              autoCapitalize="none"
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
              onChange={(text) => {
                onChange(text)
                // Clear API error when user starts typing
                if (apiError) setApiError('')
              }}
              value={value}
              placeholder="Confirm password"
              autoCapitalize="none"
            />
          )}
        />

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable title="Sign up" onPress={handleSubmit(onSubmit)} style={styles.primaryButton} />

        <Text style={[styles.text, { alignSelf: 'center', marginBottom: 8 }]}>or continue with</Text>

        <View style={styles.socials}>
          <PressableOpacity onPress={handleGoogleLogin}>
            <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
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

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      paddingVertical: 80,
      paddingHorizontal: 40,
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor: theme.white,
    },
    primaryButton: {
      width: '100%',
      alignSelf: 'stretch',
      marginVertical: 20,
      backgroundColor: theme.primary,
      color: theme.white,
    },
    title: {
      color: theme.primary,
      fontSize: 28,
      fontFamily: FontFamily.BOLD,
      marginBottom: 12,
    },
    subtitle: {
      color: theme.primary,
      fontSize: 16,
      fontFamily: FontFamily.REGULAR,
      marginBottom: 20,
    },
    text: {
      color: theme.primary,
      fontSize: 12,
      fontFamily: FontFamily.REGULAR,
    },
    link: {
      color: theme.primary,
      fontSize: 12,
      paddingVertical: 8,
      fontFamily: FontFamily.BOLD,
      textDecorationLine: 'underline',
    },
    span: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    socials: {
      flexDirection: 'row',
      gap: 28,
      alignSelf: 'center',
    },
    socialIcon: {
      width: 40,
      height: 40,
    },
    error: {
      color: theme.error,
      fontSize: 12,
      fontFamily: FontFamily.REGULAR,
    },
  })
