import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function WelcomeCreateScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const navigation = useNavigation()

  const resetManualTrip = useManualTripStore((state) => state.resetManualTrip)

  const onBack = () => {
    router.back()
  }

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = (e: any) => {
        // Prevent default navigation
        e.preventDefault()

        Alert.alert('Discard Changes', 'Are you sure you want to go back? All trip data will be cleared.', [
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
        ])
      }

      navigation.addListener('beforeRemove', handleBackPress)

      return () => {
        navigation.removeListener('beforeRemove', handleBackPress)
      }
    }, [navigation, resetManualTrip])
  )

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        Let our{'  '}
        <Text style={{ color: theme.error, fontSize: FontSize.HUGE, fontFamily: FontFamily.BOLD_ITALIC }}>
          Travel AI
        </Text>
        {'  '}
        help you plan your next trip!
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
          marginBottom: 40,
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
      paddingHorizontal: 24,
      paddingVertical: 40,
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
      marginTop: 40,
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
    dateField: {
      width: '100%',
      height: 48,
      borderRadius: 24,
      padding: 12,
      backgroundColor: colorPalettes.light.background,
      color: colorPalettes.light.primary,
    },
    backButton: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
