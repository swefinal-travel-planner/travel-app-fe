import PressableOpacity from '@/components/PressableOpacity'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface SpotCardProps {
  id: string
  name: string
  address: string
  image: { uri: string }
  onPress: (id: string) => void
}

const SpotCard: React.FC<SpotCardProps> = ({ id, name, address, image, onPress }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <PressableOpacity style={{ width: '100%' }} onPress={() => onPress(id)}>
      <View style={styles.spotCard}>
        <View style={styles.spotImageContainer}>
          <Image source={image} style={styles.spotImage} />
        </View>
        <View style={styles.spotDetails}>
          <Text style={styles.spotName}>{name}</Text>
          <View style={styles.spotLocationContainer}>
            <Ionicons name="location-outline" size={14} color={theme.text} />
            <Text style={styles.spotAddress} numberOfLines={2}>
              {address}
            </Text>
          </View>
        </View>
      </View>
    </PressableOpacity>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    spotCard: {
      flexDirection: 'row',
      borderRadius: Radius.ROUNDED,
      height: 100,
      marginBottom: 12,
      overflow: 'hidden',
      backgroundColor: theme.secondary,
    },
    spotImageContainer: {
      width: 120,
      height: 'auto',
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spotImage: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.NORMAL,
      backgroundColor: theme.disabled,
    },
    spotDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    spotName: {
      fontFamily: FontFamily.BOLD,
      fontSize: FontSize.LG,
      marginBottom: 2,
      color: theme.primary,
      paddingRight: 8,
    },
    spotLocationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
    },
    spotAddress: {
      color: theme.text,
      marginLeft: 2,
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.SM,
      flex: 1,
      flexWrap: 'wrap',
      marginRight: 8,
    },
  })

export default SpotCard
