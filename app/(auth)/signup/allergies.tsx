import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { FontFamily } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Chip from '@/components/Chip'
import CustomTextField from '@/components/input/CustomTextField'
import Pressable from '@/components/Pressable'

const data = [
  { id: '1', value: '🥜 Peanuts' },
  { id: '2', value: '🌾 Gluten' },
  { id: '3', value: '🥛 Dairy' },
  { id: '4', value: '🦀 Shellfish' },
  { id: '5', value: '🫘 Soy' },
  { id: '6', value: '🥚 Eggs' },
  { id: '7', value: '🐟 Fish' },
]

export default function SignUpAllergies() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [query, setQuery] = useState<string>('')
  const [selected, setSelected] = useState<string[]>([])
  const [hasSelectedItem, setHasSelectedItem] = useState<boolean>(false)

  const router = useRouter()

  const handlePress = () => {
    router.replace('/login')
  }

  const handleSelect = (value: string) => {
    setSelected([...selected, value])
  }

  const handleDeselect = (value: string) => {
    setSelected(selected.filter((item) => item !== value))
  }

  useEffect(() => {
    setHasSelectedItem(selected.length > 0)
  }, [selected])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Allergy info</Text>
        <Text style={styles.subtitle}>Do you have any allergies we should know about?</Text>

        <CustomTextField placeholder="Type to search" leftIcon="search-outline" onChange={setQuery} />

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginVertical: 12,
            rowGap: 12,
          }}
        >
          {data
            .filter((item) => item.value.toLowerCase().includes(query.toLowerCase()))
            .map((item) => (
              <Chip size="large" key={item.id} value={item.value} onSelect={handleSelect} onDeselect={handleDeselect} />
            ))}
        </View>

        <Pressable
          title="Save"
          onPress={handlePress}
          disabled={!hasSelectedItem}
          style={{
            marginTop: 36,
            backgroundColor: hasSelectedItem ? theme.primary : theme.disabled,
            color: hasSelectedItem ? theme.white : theme.text,
          }}
        />

        <Pressable onPress={handlePress} title="Skip for now" />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      paddingVertical: 80,
      paddingHorizontal: 40,
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor: theme.white,
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
  })
