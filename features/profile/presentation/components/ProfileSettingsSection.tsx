import { SettingSection } from '@/app/(tabs)/profile'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type ProfileSettingsSectionProps = {
  generalSection: SettingSection[]
  openModal: (title: string) => void
  setShowActionSheet: (value: boolean) => void
}

const ProfileSettingsSection = ({ generalSection, openModal, setShowActionSheet }: ProfileSettingsSectionProps) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.header}>General</Text>
      </View>
      <View style={[styles.sectionContainer]}>
        {generalSection.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.title.includes('picture') ? () => setShowActionSheet(true) : () => openModal(item.title)}
          >
            <View style={styles.sectionItemContainer}>
              <View style={styles.sectionItem}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                  <Ionicons name={item.icon} size={20} color={theme.white} />
                </View>
                <Text style={styles.text}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={theme.black} />
            </View>
          </TouchableOpacity>
        ))}
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
      color: theme.text,
    },
    text: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
    },
  })

export default ProfileSettingsSection
