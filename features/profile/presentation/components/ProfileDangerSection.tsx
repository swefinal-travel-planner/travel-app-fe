import { SettingSection } from '@/app/(tabs)/profile'
import { colorPalettes } from '@/constants/Itheme'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-ui-lib'

type ProfileDangerSectionProps = {
  theme: typeof colorPalettes.light
  dangerSection: SettingSection[]
  isDarkTheme: boolean
  setIsDarkTheme: (value: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

const ProfileDangerSection = ({
  theme,
  dangerSection,
  isDarkTheme,
  setIsDarkTheme,
  setTheme,
}: ProfileDangerSectionProps) => (
  <>
    <View style={styles.sectionHeader}>
      <Ionicons name="alert-circle-outline" size={25} color="red" />
      <Text text70 color="red">
        Danger Zone
      </Text>
    </View>
    <Card style={[styles.sectionContainer, { borderColor: theme.background }]}>
      {dangerSection.map((item, index) =>
        item.title === 'Change theme' ? (
          <View key={index} style={styles.sectionItemContainer}>
            <View style={styles.sectionItem}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                <Ionicons name={item.icon} size={20} color="white" />
              </View>
              <Text>{item.title}</Text>
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
                <Text>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </View>
          </TouchableOpacity>
        )
      )}
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

export default ProfileDangerSection
