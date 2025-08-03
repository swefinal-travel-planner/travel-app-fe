import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import React, { useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'

type WaitScreenProps = {
  theme: typeof colorPalettes.light
}

export default function WaitScreen({ theme }: Readonly<WaitScreenProps>) {
  const router = useRouter()
  const animation = useRef<LottieView>(null)

  useEffect(() => {
    animation.current?.play()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>Your trip is being prepared!</Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        This may take a while. We will notify you when it's ready.
      </Text>

      <View style={styles.textFieldContainer}>
        <LottieView
          source={require('@/assets/animations/TripInProgress.json')}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>

      <Pressable
        onPress={() => router.replace('/(tabs)')}
        title="Go home"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
    backgroundColor: '#ffffff',
  },
  textFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '65%',
  },
  textQuestion: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: FontFamily.BOLD,
    fontSize: FontSize.XXXL,
  },
  subTextQuestion: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.MD,
  },
  textField: {
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.XL,
  },
  errorText: {
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.LG,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    fontFamily: FontFamily.BOLD,
    fontSize: FontSize.XL,
  },
  dateField: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    padding: 12,
    backgroundColor: colorPalettes.light.background,
    color: colorPalettes.light.primary,
  },
})
