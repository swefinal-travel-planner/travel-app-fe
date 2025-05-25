import { Padding, Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { ApiTranslate } from '@/services/api/tools/ApiTranslate'
import { colorPalettes } from '@/styles/Itheme'
import React, { useMemo, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { Picker } from 'react-native-ui-lib'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'ja', label: 'Japanese' },
]

const getLanguageLabel = (code: string) => {
  const language = LANGUAGES.find((lang) => lang.code === code)
  return language ? language.label : code
}

export default function Translate() {
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const translateText = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    setTranslatedText('')

    try {
      const response = await ApiTranslate(
        inputText,
        getLanguageLabel(sourceLang),
        getLanguageLabel(targetLang)
      )

      setTranslatedText(response)
    } catch (err) {
      console.error(err)
      setTranslatedText('Error translating text.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          placeholder="Select source language"
          value={sourceLang}
          onChange={(item) => setSourceLang(item?.toString() ?? sourceLang)}
          topBarProps={{ title: 'Source Language' }}
          style={styles.picker}
          items={LANGUAGES.map((lang) => ({
            label: lang.label,
            value: lang.code,
          }))}
        />

        <Picker
          placeholder="Select target language"
          value={targetLang}
          onChange={(item) => setTargetLang(item?.toString() ?? targetLang)}
          topBarProps={{ title: 'Target Language' }}
          style={styles.picker}
          items={LANGUAGES.map((lang) => ({
            label: lang.label,
            value: lang.code,
          }))}
        />
      </View>

      <TextInput
        placeholder="Enter text"
        style={styles.input}
        multiline
        numberOfLines={4}
        value={inputText}
        onChangeText={setInputText}
      />

      <View style={styles.outputContainer}>
        <Text>{loading ? 'Translating...' : translatedText}</Text>
      </View>

      <Button title="Translate" onPress={translateText} disabled={loading} />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      top: Padding.TOOL_SPACING,
      paddingHorizontal: 16,
    },
    pickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    label: {
      fontWeight: 'bold',
      marginTop: 10,
    },
    picker: {
      minHeight: 50,
      minWidth: 120,
      borderRadius: Radius.FULL,
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: theme.background,
    },
    input: {
      borderRadius: Radius.NORMAL,
      padding: 10,
      marginBottom: 16,
      backgroundColor: '#fff',
      minHeight: 100,
    },
    outputContainer: {
      minHeight: 100,
      padding: 12,
      backgroundColor: theme.surface,
      borderRadius: Radius.NORMAL,
      marginBottom: 10,
    },
    translatedLabel: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    translatedText: {
      fontSize: 16,
    },
  })
