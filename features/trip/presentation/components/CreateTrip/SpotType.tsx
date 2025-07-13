import CollapsibleSectionList from '@/components/CollapsibleSectionList'
import Pressable from '@/components/Pressable'
import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import spotTypeData from '@/lib/mock_data/spotTypes'
import { useAiTripStore } from '@/store/useAiTripStore'
import { formatAttribute } from '@/utils/tripAttributes'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'

type SpotTypeProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function SpotType({ theme, nextFn }: Readonly<SpotTypeProps>) {
  const setLocAttributes = useAiTripStore((state) => state.setLocAttributes)
  const request = useAiTripStore((state) => state.request)

  const [spotTypes, setSpotTypes] = useState<string[]>(request?.enLocationAttributes ?? [])

  useEffect(() => {
    setLocAttributes(
      spotTypes.map((type) => formatAttribute(type)),
      []
    )
  }, [spotTypes])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>What type of spots do you want to visit?</Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        Scroll to see all categories, and tap to expand each category.
      </Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>Select at least one category to continue.</Text>

      <View style={styles.textFieldContainer}>
        <CollapsibleSectionList data={spotTypeData} selectedValues={spotTypes} onValueChange={setSpotTypes} />
      </View>

      {spotTypes.length > 0 && (
        <Text style={[styles.textField, { color: theme.primary }]}>
          {spotTypes.length === 1
            ? 'Selected 1 category'
            : spotTypes.length > 1
              ? `Selected ${spotTypes.length} categories`
              : ''}
        </Text>
      )}

      <Pressable
        onPress={nextFn}
        title="Next"
        style={{
          color: theme.white,
          backgroundColor: theme.primary,
        }}
        disabled={spotTypes.length === 0}
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
