import { colorPalettes } from '@/constants/Itheme'
import { StyleSheet } from 'react-native'

export const createModalStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: theme.white,
    },
    modalContent: {
      flex: 1,
      padding: 20,
    },
    placesList: {
      flex: 1,
    },
    placesListContent: {
      gap: 15,
    },
  })
