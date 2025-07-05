import { SettingSection } from '@/app/(tabs)/profile'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo } from 'react'
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'

type ProfileDangerSectionProps = {
  dangerSection: SettingSection[]
  isDarkTheme: boolean
  setIsDarkTheme: (value: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

const ProfileDangerSection = ({ dangerSection, isDarkTheme, setIsDarkTheme, setTheme }: ProfileDangerSectionProps) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.header}>Danger zone</Text>
      </View>
      <View style={[styles.sectionContainer, { borderColor: theme.background }]}>
        {dangerSection.map((item, index) =>
          item.title === 'Change theme' ? (
            <View key={index} style={styles.sectionItemContainer}>
              <View style={styles.sectionItem}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                  <Ionicons name={item.icon} size={20} color="white" />
                </View>
                <Text style={styles.text}>{item.title}</Text>
              </View>
              <Switch
                value={isDarkTheme}
                onValueChange={(value) => {
                  setIsDarkTheme(value)
                  setTheme(value ? 'dark' : 'light')
                }}
              />
            </View>
          ) : (
            <TouchableOpacity key={index} onPress={item.onPress ?? (() => {})}>
              <View style={styles.sectionItemContainer}>
                <View style={styles.sectionItem}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                    <Ionicons name={item.icon} size={20} color="white" />
                  </View>
                  <Text style={styles.text}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="black" />
              </View>
            </TouchableOpacity>
          )
        )}
      </View>
    </>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      gap: 5,
    },
    sectionContainer: {
      borderRadius: Radius.ROUNDED,
      padding: 15,
      marginBottom: 25,
      backgroundColor: theme.background,
    },
    sectionItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      alignItems: 'center',
    },
    sectionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconContainer: {
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: theme.error,
    },
    text: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
    },
  })

export default ProfileDangerSection
