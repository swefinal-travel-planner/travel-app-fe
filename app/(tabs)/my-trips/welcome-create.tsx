import { FontFamily, FontSize } from '@/constants/font'
import { useManualTripStore } from '@/features/trip/presentation/state/useManualTrip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Alert, StyleSheet, Text } from 'react-native'
import { Button, View } from 'react-native-ui-lib'

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
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <View>
        <Text style={styles.text}>
          Let's create an
          <Text style={styles.italicText}> AI planning trip </Text>
          together!
        </Text>
      </View>
      <View style={{ width: '80%', gap: 10 }}>
        <Button
          backgroundColor={theme.primary}
          onPress={() => router.push('/(tabs)/my-trips/create-ai-trip')}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>
            Start creating an AI trip
          </Text>
        </Button>
        <Button
          backgroundColor={theme.secondary}
          onPress={() => router.push('/(tabs)/my-trips/create-manual-trip')}
        >
          <Text style={[styles.buttonText, { color: theme.black }]}>
            Create a trip manually
          </Text>
        </Button>
      </View>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 20,
      paddingTop: 90,
    },
    text: {
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.XXXL,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    italicText: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.XXXL,
    },
    buttonText: {
      fontFamily: FontFamily.REGULAR,
      fontSize: 16,
      color: theme.white,
    },
  })
