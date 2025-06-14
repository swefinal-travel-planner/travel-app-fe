import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'

export default function WelcomeCreateScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()
  const navigation = useNavigation()
  const resetManualTrip = useManualTripStore((state) => state.resetManualTrip)

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = (e: any) => {
        // Prevent default navigation
        e.preventDefault()

        Alert.alert(
          'Discard Changes',
          'Are you sure you want to go back? All trip data will be cleared.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes, go back',
              style: 'destructive',
              onPress: () => {
                resetManualTrip()
                navigation.dispatch(e.data.action)
              },
            },
          ]
        )
      }

      navigation.addListener('beforeRemove', handleBackPress)

      return () => {
        navigation.removeListener('beforeRemove', handleBackPress)
      }
    }, [navigation, resetManualTrip])
  )

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        Let our AI help you plan your next trip!
      </Text>

      <View style={styles.textFieldContainer}></View>

      <Pressable
        onPress={() => router.push('/(tabs)/my-trips/create-ai-trip')}
        title="Start"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
      />

      <Pressable
        onPress={() => router.push('/(tabs)/my-trips/create-manual-trip')}
        title="Plan a trip manually"
        style={{
          color: theme.text,
          backgroundColor: theme.secondary,
        }}
      />

      <Pressable
        onPress={() => router.push('/(tabs)/my-trips')}
        title="Cancel"
        style={{
          color: theme.text,
          backgroundColor: theme.background,
        }}
      />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 120,
      backgroundColor: theme.white,
    },
    textFieldContainer: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60%',
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
