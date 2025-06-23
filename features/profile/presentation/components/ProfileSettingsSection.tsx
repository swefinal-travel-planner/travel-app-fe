import { SettingSection } from '@/app/(tabs)/profile'
import { colorPalettes } from '@/constants/Itheme'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-ui-lib'

type ProfileSettingsSectionProps = {
  theme: typeof colorPalettes.light
  generalSection: SettingSection[]
  openModal: (title: string) => void
  setShowActionSheet: (value: boolean) => void
}

const ProfileSettingsSection = ({
  theme,
  generalSection,
  openModal,
  setShowActionSheet,
}: ProfileSettingsSectionProps) => (
  <>
    <View style={styles.sectionHeader}>
      <Ionicons name="settings" size={25} color={theme.black} />
      <Text text70>General</Text>
    </View>
    <Card style={[styles.sectionContainer, { borderColor: theme.background }]}>
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
              <Text>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={theme.black} />
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  </>
)

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  sectionContainer: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
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
})

export default ProfileSettingsSection
