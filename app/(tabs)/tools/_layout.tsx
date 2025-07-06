import { colorPalettes } from '@/constants/Itheme'
import { IconSize, Padding, Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Stack, usePathname, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

export default function ToolLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.safeAreaContainer}>
      {/* Tools Top Tabs with Icons Only */}
      <View style={styles.floatingNavContainer}>
        <TabButton
          icon="cloud"
          active={pathname.startsWith('/tools/weather') || pathname.includes('forecast')}
          onPress={() => router.push('/(tabs)/tools/weather')}
        />
        <TabButton
          icon="cash"
          active={pathname.startsWith('/tools/currency-converter') || pathname === '/tools'}
          onPress={() => router.push('/(tabs)/tools/currency-converter')}
        />
        <TabButton
          icon="language"
          active={pathname.startsWith('/tools/translate')}
          onPress={() => router.push('/(tabs)/tools/translate')}
        />
      </View>

      {/* Nested Stack Navigator */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}>
        <Stack.Screen name="currency-converter" />
        <Stack.Screen name="weather" />
        <Stack.Screen name="translate" />
        <Stack.Screen name="forecast" />
      </Stack>
    </View>
  )
}

// Reusable Tab Button Component (Icon Only)
function TabButton({
  icon,
  onPress,
  active,
}: Readonly<{
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  active: boolean
}>) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <TouchableOpacity onPress={onPress} style={[active ? styles.activeTab : styles.tabButton]}>
      <Ionicons name={icon} size={IconSize.MD} color={theme.primary} />
    </TouchableOpacity>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      paddingHorizontal: Padding.SMALL,
      paddingTop: Padding.XLARGE,
    },
    container: {
      flex: 1,
    },
    floatingNavContainer: {
      flexDirection: 'row',
      padding: Padding.MEDIUM,
      borderRadius: Radius.FULL,
      backgroundColor: theme.green,
      justifyContent: 'center',
      position: 'absolute',
      top: 55,
      alignSelf: 'center',
      zIndex: 10,
    },
    tabButton: {
      padding: Padding.NORMAL,
      borderRadius: Radius.FULL,
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    activeTab: {
      backgroundColor: theme.secondary,
      padding: Padding.NORMAL,
      borderRadius: Radius.FULL,
      alignItems: 'center',
    },
  })
