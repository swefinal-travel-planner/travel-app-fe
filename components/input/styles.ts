import { colorPalettes } from '@/styles/Itheme'
import { StyleSheet } from 'react-native'

export const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      borderWidth: 1,
      borderColor: '#3F6453',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    leftIcon: {
      color: theme.primary,
      marginLeft: 12,
    },
    rightIcon: {
      color: theme.primary,
      marginRight: 12,
    },
    input: {
      flex: 1,
      marginHorizontal: 12,
      paddingVertical: 12,
      paddingRight: 12,
      paddingLeft: 0,
      borderRadius: 100,
      color: theme.black,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    pinCodeContainer: {
      borderRadius: 0,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: theme.primary,
    },
    pinCodeText: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 36,
      color: theme.black,
    },
    focusedPinCodeContainer: {
      borderBottomWidth: 2,
      borderColor: theme.primary,
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 12,
    },
  })
