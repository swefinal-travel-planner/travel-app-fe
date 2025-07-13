import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const NoItemsMessage: React.FC = () => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.noItemsContainer}>
      <Text style={styles.noItemsText}>No trip items found</Text>
      <Text style={styles.noItemsSubText}>This trip doesn't have any planned spots yet.</Text>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    noItemsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      marginHorizontal: 24,
    },
    noItemsText: {
      fontSize: FontSize.XL,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    noItemsSubText: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      textAlign: 'center',
      opacity: 0.7,
    },
  })

export default NoItemsMessage
