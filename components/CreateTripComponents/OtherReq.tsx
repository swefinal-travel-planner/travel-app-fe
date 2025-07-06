import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import otherReqData from '@/lib/mock_data/otherReqs'
import { useAiTripStore } from '@/store/useAiTripStore'
import { formatAttribute } from '@/utils/tripAttributes'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import CollapsibleSectionList from '../CollapsibleSectionList'
import Pressable from '../Pressable'

type OtherReqProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function OtherReq({ theme, nextFn }: Readonly<OtherReqProps>) {
  const request = useAiTripStore((state) => state.request)

  const [otherReqs, setOtherReqs] = useState<string[]>(
    request?.enSpecialRequirements ? request.enSpecialRequirements.filter((req) => req !== 'none') : []
  )

  const setSpecialRequirements = useAiTripStore((state) => state.setSpecialRequirements)

  const handleNext = () => {
    nextFn()
  }

  useEffect(() => {
    setSpecialRequirements(
      otherReqs.map((req) => formatAttribute(req)),
      []
    )

    if (otherReqs.length === 0) {
      setSpecialRequirements(['none'], [])
    }
  }, [otherReqs])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        Finally, do you have any other requirements or preferences?
      </Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        Scroll to see all categories, and tap to expand each category.
      </Text>

      <Text style={[styles.subTextQuestion, { color: theme.text, marginTop: -16 }]}>
        If you have no requirements, you can skip this step and press Next.
      </Text>

      <View style={styles.textFieldContainer}>
        <CollapsibleSectionList data={otherReqData} selectedValues={otherReqs} onValueChange={setOtherReqs} />
      </View>

      {otherReqs.length > 0 && (
        <Text style={[styles.textField, { color: theme.primary }]}>
          {otherReqs.length === 1
            ? 'Selected 1 category'
            : otherReqs.length > 1
              ? `Selected ${otherReqs.length} categories`
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
