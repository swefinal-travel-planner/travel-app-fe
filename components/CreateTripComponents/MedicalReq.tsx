import { FontFamily, FontSize } from '@/constants/font'
import medicalReqData from '@/lib/mock_data/medicalReqs'
import { useAiTripStore } from '@/store/useAiTripStore'
import { colorPalettes } from '@/styles/Itheme'
import { formatAttribute } from '@/utils/tripAttributes'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import CollapsibleSectionList from '../CollapsibleSectionList'
import Pressable from '../Pressable'

type MedicalReqProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function MedicalReq({
  theme,
  nextFn,
}: Readonly<MedicalReqProps>) {
  const request = useAiTripStore((state) => state.request)

  const [medicalReqs, setMedicalReqs] = useState<string[]>(
    request?.enMedicalConditions
      ? request.enMedicalConditions.filter((req) => req !== 'none')
      : []
  )

  const setMedicalConditions = useAiTripStore(
    (state) => state.setMedicalConditions
  )

  const handleNext = () => {
    nextFn()
  }

  useEffect(() => {
    setMedicalConditions(
      medicalReqs.map((req) => formatAttribute(req)),
      []
    )

    if (medicalReqs.length === 0) {
      setMedicalConditions(['none'], ['không'])
    }
  }, [medicalReqs])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        Do you have any medical or dietary requirements?
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
      </View>

      {medicalReqs.length > 0 && (
        <Text style={[styles.textField, { color: theme.primary }]}>
          {medicalReqs.length === 1 && medicalReqs[0] !== 'none'
            ? 'Selected 1 category'
            : medicalReqs.length > 1
              ? `Selected ${medicalReqs.length} categories`
              : ''}
        </Text>
      )}

      <Pressable
        onPress={handleNext}
        title="Next"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: FontSize.MD,
  },
})
