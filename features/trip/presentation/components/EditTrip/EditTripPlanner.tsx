import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useManualTripStore } from '../../state/useManualTrip'
import UpdateManualTrip from '../CreateTrip/Manual/UpdateManualTrip'

/**
 * Trip editing component that uses the UpdateManualTrip component in edit mode
 */
export default function EditTripPlanner() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const { resetManualTrip } = useManualTripStore()

  // Reset the store when accessing the trip edit screen
  useEffect(() => {
    resetManualTrip()
    // Note: No cleanup function to avoid state changes during unmount
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header and Back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modify trip</Text>
        <View style={styles.placeholder} />
      </View>

      <UpdateManualTrip mode="edit" tripId={id as string} />
    </GestureHandlerRootView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
      paddingTop: 40,
    },
    header: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 22,
      paddingBottom: 16,
    },
    placeholder: {
      width: 40,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: FontSize.XXL,
      textAlign: 'center',
      flex: 1,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    listContent: {
      paddingHorizontal: 24,
    },
    spotCard: {
      flexDirection: 'row',
      marginBottom: 12,
      overflow: 'hidden',
      alignItems: 'center',
      backgroundColor: theme.secondary,
      borderRadius: Radius.ROUNDED,
    },
    dragHandle: {
      paddingVertical: 8,
      paddingLeft: 12,
    },
    spotImageContainer: {
      width: 90,
      height: 80,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spotImage: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.NORMAL,
    },
    spotDetails: {
      flex: 1,
      padding: 12,
      justifyContent: 'center',
    },
    spotName: {
      fontSize: FontSize.LG,
      fontWeight: '500',
      marginBottom: 6,
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
    },
    spotLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spotAddress: {
      fontSize: FontSize.SM,
      color: theme.text,
      marginLeft: 4,
      fontFamily: FontFamily.REGULAR,
    },
    deleteButton: {
      paddingVertical: 8,
      paddingRight: 12,
      paddingLeft: 4,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.dimText || '#E0E0E0',
      opacity: 0.3,
    },
    dayDivider: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dayDividerText: {
      fontSize: FontSize.XL,
      color: theme.primary,
      marginHorizontal: 12,
      fontFamily: FontFamily.BOLD,
      backgroundColor: theme.white,
      paddingHorizontal: 8,
    },
    timeDivider: {
      marginVertical: 12,
    },
    timeDividerText: {
      fontSize: FontSize.LG,
      color: theme.primary,
      fontFamily: FontFamily.BOLD,
      textAlign: 'left',
    },
    buttonContainer: {
      marginVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: 'transparent',
    },
  })
