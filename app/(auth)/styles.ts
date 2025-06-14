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
      color: '#3F6453',
      fontSize: 28,
      fontFamily: FontFamily.BOLD,
      marginBottom: 12,
    },
    subtitle: {
      color: '#3F6453',
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_400Regular',
      marginBottom: 20,
    },
    text: {
      color: '#3F6453',
      fontSize: 12,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    link: {
      color: '#3F6453',
      fontSize: 12,
      fontFamily: 'PlusJakartaSans_700Bold',
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
      color: '#A82A00',
      fontSize: 12,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
  })
