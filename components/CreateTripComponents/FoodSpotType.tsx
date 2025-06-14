import { FontFamily, FontSize } from '@/constants/font'
import foodSpotTypeData from '@/lib/mock_data/foodSpotTypes'
import { useAiTripStore } from '@/store/useAiTripStore'
import { colorPalettes } from '@/styles/Itheme'
import { formatAttribute } from '@/utils/tripAttributes'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import CollapsibleSectionList from '../CollapsibleSectionList'
import Pressable from '../Pressable'

type FoodSpotTypeProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function FoodSpotType({
  theme,
  nextFn,
}: Readonly<FoodSpotTypeProps>) {
  const setFoodAttributes = useAiTripStore((state) => state.setFoodAttributes)
  const request = useAiTripStore((state) => state.request)

  const [foodSpotTypes, setFoodSpotTypes] = useState<string[]>(
    request?.enFoodAttributes ?? []
  )

  useEffect(() => {
    setFoodAttributes(
      foodSpotTypes.map((type) => formatAttribute(type)),
      []
    )
  }, [foodSpotTypes])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        What type of culinary spots do you want to visit?
      </Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        Scroll to see all categories, and tap to expand each category.
      </Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        Select at least one category to continue.
      </Text>

      <View style={styles.textFieldContainer}>
        <CollapsibleSectionList
          data={foodSpotTypeData}
          selectedValues={foodSpotTypes}
          onValueChange={setFoodSpotTypes}
        />
      </View>

      {foodSpotTypes.length > 0 && (
        <Text style={[styles.textField, { color: theme.primary }]}>
          {foodSpotTypes.length === 1
            ? 'Selected 1 category'
            : foodSpotTypes.length > 1
              ? `Selected ${foodSpotTypes.length} categories`
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
        disabled={foodSpotTypes.length === 0}
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
