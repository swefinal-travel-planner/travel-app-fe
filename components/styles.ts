import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { StyleSheet } from 'react-native'

export const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      paddingVertical: 80,
      paddingHorizontal: 40,
      alignItems: 'flex-start',
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
