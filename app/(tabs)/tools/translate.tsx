import { UniversalPicker } from '@/components/CommonPicker'
import { colorPalettes } from '@/constants/Itheme'
import { FontFamily, FontSize } from '@/constants/font'
import { Radius } from '@/constants/theme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { ApiTranslate } from '@/services/api/tools/ApiTranslate'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
]

const getLanguageLabel = (code: string) => {
  const language = LANGUAGES.find((lang) => lang.code === code)
  return language ? language.label : code
}

export default function Translate() {
  const [sourceLang, setSourceLang] = useState(LANGUAGES[0])
  const [targetLang, setTargetLang] = useState(LANGUAGES[1])
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const translateText = useCallback(async () => {
    if (!inputText.trim()) return

    setLoading(true)
    setTranslatedText('')

    try {
      const response = await ApiTranslate(
        inputText,
        getLanguageLabel(sourceLang.code),
        getLanguageLabel(targetLang.code)
      )
      setTranslatedText(response)
    } catch (err) {
      console.error(err)
      setTranslatedText('Error translating text.')
    } finally {
      setLoading(false)
    }
  }, [inputText, sourceLang.code, targetLang.code])

  const swapLanguages = () => {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setInputText(translatedText)
    setTranslatedText('')
  }

  const clearText = () => {
    setInputText('')
    setTranslatedText('')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Selection */}
      <View style={styles.languageContainer}>
        <View style={styles.languageBox}>
          <Text style={styles.languageLabel}>From</Text>
          <UniversalPicker
            data={LANGUAGES}
            keyExtractor={(item) => item.code}
            labelExtractor={(item) => `${item.flag} ${item.label}`}
            initialValue={sourceLang}
            onSelect={setSourceLang}
            style={styles.pickerStyle}
            placeholder="Select source language"
          />
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
          <Ionicons name="swap-horizontal" size={20} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.languageBox}>
          <Text style={styles.languageLabel}>To</Text>
          <UniversalPicker
            data={LANGUAGES}
            keyExtractor={(item) => item.code}
            labelExtractor={(item) => `${item.flag} ${item.label}`}
            initialValue={targetLang}
            onSelect={setTargetLang}
            style={styles.pickerStyle}
            placeholder="Select target language"
          />
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>
            {sourceLang.flag} {sourceLang.label}
          </Text>
          {inputText.length > 0 && (
            <TouchableOpacity onPress={clearText} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          placeholder="Enter text to translate..."
          style={styles.input}
          multiline
          numberOfLines={4}
          value={inputText}
          onChangeText={setInputText}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{inputText.length} characters</Text>
      </View>

      {/* Translate Button */}
      <TouchableOpacity
        style={[styles.translateButton, (!inputText.trim() || loading) && styles.translateButtonDisabled]}
        onPress={translateText}
        disabled={!inputText.trim() || loading}
      >
        <Ionicons name={loading ? 'hourglass-outline' : 'language-outline'} size={20} color="white" />
        <Text style={styles.translateButtonText}>{loading ? 'Translating...' : 'Translate'}</Text>
      </TouchableOpacity>

      {/* Output Section */}
      <View style={styles.outputContainer}>
        <View style={styles.outputHeader}>
          <Text style={styles.outputLabel}>
            {targetLang.flag} {targetLang.label}
          </Text>
          {translatedText && !loading && (
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.outputBox}>
          <Text style={styles.outputText}>
            {loading ? 'Translating...' : translatedText || 'Translation will appear here'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 16,
      paddingTop: 110,
      paddingBottom: 16,
    },
    languageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 24,
      backgroundColor: 'white',
      borderRadius: Radius.ROUNDED,
      padding: 16,
    },
    languageBox: {
      flex: 1,
    },
    languageLabel: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.BOLD,
      color: theme.primary,
      marginBottom: 8,
    },
    pickerStyle: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
      borderRadius: Radius.FULL,
    },
    swapButton: {
      backgroundColor: theme.secondary,
      borderRadius: 100,
      padding: 12,
      marginHorizontal: 16,
    },
    inputContainer: {
      backgroundColor: 'white',
      borderRadius: Radius.ROUNDED,
      padding: 16,
      marginBottom: 16,
    },
    inputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    inputLabel: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    clearButton: {
      padding: 4,
    },
    input: {
      minHeight: 120,
      fontSize: FontSize.LG,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      padding: 16,
      backgroundColor: theme.background,
      borderRadius: Radius.NORMAL,
      textAlignVertical: 'top',
    },
    charCount: {
      fontSize: FontSize.SM,
      fontFamily: FontFamily.REGULAR,
      color: '#666',
      textAlign: 'right',
      marginTop: 8,
    },
    translateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      borderRadius: Radius.FULL,
      paddingVertical: 16,
      marginBottom: 16,
      gap: 8,
    },
    translateButtonDisabled: {
      backgroundColor: '#ccc',
    },
    translateButtonText: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.BOLD,
      color: 'white',
    },
    outputContainer: {
      backgroundColor: 'white',
      borderRadius: Radius.ROUNDED,
      padding: 16,
      flex: 1,
    },
    outputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    outputLabel: {
      fontSize: FontSize.MD,
      fontFamily: FontFamily.BOLD,
      color: theme.text,
    },
    copyButton: {
      padding: 4,
    },
    outputBox: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: Radius.NORMAL,
      padding: 16,
      justifyContent: 'flex-start',
    },
    outputText: {
      fontSize: FontSize.LG,
      fontFamily: FontFamily.REGULAR,
      color: theme.text,
      lineHeight: 24,
    },
  })
