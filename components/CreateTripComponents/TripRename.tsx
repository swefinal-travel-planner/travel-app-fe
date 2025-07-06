import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { TripRequest } from '@/store/useAiTripStore'
import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, TextField, View } from 'react-native-ui-lib'

type TripRenameProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
  setTripState: (trip: Partial<TripRequest>) => void
  getTripState?: TripRequest | null
}

export default function TripRename({ theme, nextFn, setTripState, getTripState }: Readonly<TripRenameProps>) {
  const styles = useMemo(() => createStyles(theme), [theme])
  const [title, setTitle] = useState(getTripState?.title ?? '')

  const handleNext = () => {
    if (title.trim()) {
      setTripState({ title: title.trim() })
      nextFn()
    }
  }
  console.log('city', getTripState?.city)

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <Text style={[styles.text, { color: theme.primary }]}>What would you like to call your trip?</Text>

      <View style={styles.inputContainer}>
        <TextField
          placeholder="Enter trip title"
          value={title}
          onChangeText={setTitle}
          style={styles.textField}
          placeholderTextColor={theme.dimText}
          maxLength={50}
        />
        {getTripState?.city && (
          <Text style={[styles.locationText, { color: theme.dimText }]}>Trip to {getTripState.city}</Text>
        )}
      </View>

      <Pressable
        onPress={handleNext}
        title="Next"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
        disabled={!title.trim()}
      />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    inputContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    textField: {
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.XL,
      backgroundColor: theme.background,
      minWidth: '100%',
      height: 56,
      borderRadius: Radius.FULL,
      paddingHorizontal: 20,
      paddingVertical: 16,
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    locationText: {
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.MD,
      textAlign: 'center',
    },
    text: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.XXXL,
      textAlign: 'center',
      marginBottom: 20,
    },
  })
