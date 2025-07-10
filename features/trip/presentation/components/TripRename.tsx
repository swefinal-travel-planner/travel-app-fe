import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { TripRequest } from '@/store/useAiTripStore'
import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, TextField, View } from 'react-native-ui-lib'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

type TripRenameProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
  setTripState: (trip: Partial<TripRequest>) => void
  getTripState?: TripRequest | null
  onSubmit?: () => void
  isSubmitting?: boolean
}

export default function TripRename({
  theme,
  nextFn,
  setTripState,
  getTripState,
  onSubmit,
  isSubmitting = false,
}: Readonly<TripRenameProps>) {
  const styles = useMemo(() => createStyles(theme), [theme])
  const [localTitle, setLocalTitle] = useState('')

  const handleSubmit = () => {
    setTripState({ title: localTitle.trim() })
    if (onSubmit) {
      // Use localTitle directly, since it's the source of truth here
      onSubmit()
    }
    nextFn()
  }

  const isDisabled = !localTitle.trim() || isSubmitting
  const buttonTitle = isSubmitting ? 'Creating...' : 'Create Trip'

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <Text style={[styles.text, { color: theme.primary }]}>What would you like to call your trip?</Text>

      <View style={styles.inputContainer}>
        <TextField
          placeholder="Enter trip title"
          value={localTitle}
          onChangeText={setLocalTitle}
          style={styles.textField}
          placeholderTextColor={theme.dimText}
          maxLength={50}
          editable={!isSubmitting}
        />
        {getTripState?.city && (
          <Text style={[styles.locationText, { color: theme.dimText }]}>Trip to {getTripState.city}</Text>
        )}
      </View>

      <Pressable
        onPress={handleSubmit}
        title={buttonTitle}
        style={{
          color: theme.white,
          backgroundColor: isDisabled ? theme.disabled : theme.primary,
        }}
        disabled={isDisabled}
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
