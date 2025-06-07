import { FontFamily, FontSize } from '@/constants/font'
import medicalReqData from '@/lib/mock_data/medicalReqs'
import { colorPalettes } from '@/styles/Itheme'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'react-native-ui-lib'
import CollapsibleSectionList from '../CollapsibleSectionList'

type MedicalReqProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function MedicalReq({
  theme,
  nextFn,
}: Readonly<MedicalReqProps>) {
  const [medicalReqs, setMedicalReqs] = useState<string[]>([])

  const handleNext = () => {
    nextFn()
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        Do you have any medical requirements or dietary restrictions?
      </Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        Scroll to see all categories, and tap to expand each category.
      </Text>

      <View style={styles.textFieldContainer}>
        <CollapsibleSectionList
          data={medicalReqData}
          selectedValues={medicalReqs}
          onValueChange={setMedicalReqs}
        />

        <Text
          style={[styles.textField, { color: theme.primary, marginTop: 40 }]}
        >
          {medicalReqs.length === 1
            ? 'Selected 1 category'
            : medicalReqs.length > 1
              ? `Selected ${medicalReqs.length} categories`
              : ''}
        </Text>
      </View>

      <Button
        onPress={handleNext}
        label="Next"
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15 }}
        size="large"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  textFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    height: '60%',
  },
  textQuestion: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: FontFamily.BOLD,
    fontSize: FontSize.XXXL,
  },
  subTextQuestion: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.MD,
  },
  textField: {
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.XL,
  },
  errorText: {
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
    fontSize: FontSize.LG,
  },
  dateField: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    padding: 12,
    backgroundColor: colorPalettes.light.background,
    color: colorPalettes.light.primary,
  },
})
