import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useMemo } from 'react'
import { Button, View } from 'react-native-ui-lib'
import { StyleSheet, Text } from 'react-native'
import { colorPalettes } from '@/styles/Itheme'
import { FontFamily, FontSize } from '@/constants/font'
import { useRouter } from 'expo-router'

export default function WelcomeCreateScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()

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
          backgroundColor={theme.primarySubtle}
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
