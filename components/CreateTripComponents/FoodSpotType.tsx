import { FontFamily, FontSize } from '@/constants/font'
import foodSpotTypeData from '@/lib/mock_data/foodSpotTypes'
import { colorPalettes } from '@/styles/Itheme'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'react-native-ui-lib'
import CollapsibleSectionList from '../CollapsibleSectionList'

type FoodSpotTypeProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function FoodSpotType({
  theme,
  nextFn,
}: Readonly<FoodSpotTypeProps>) {
  const [foodSpotTypes, setFoodSpotTypes] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleNext = () => {
    if (foodSpotTypes.length === 0) {
      setErrorMessage('Please select at least one category of culinary spot.')
      return
    }

    setErrorMessage(null)
    nextFn()
  }

  useEffect(() => {
    if (foodSpotTypes.length > 0) {
      setErrorMessage(null)
    }
  }, [foodSpotTypes])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        What type of culinary spots do you want to visit?
      </Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        Scroll to see all categories, and tap to expand each category.
      </Text>

      <View style={styles.textFieldContainer}>
        <CollapsibleSectionList
          data={foodSpotTypeData}
          selectedValues={foodSpotTypes}
          onValueChange={setFoodSpotTypes}
        />

        <Text
          style={[styles.textField, { color: theme.primary, marginTop: 40 }]}
        >
          {foodSpotTypes.length === 1
            ? 'Selected 1 category'
            : foodSpotTypes.length > 1
              ? `Selected ${foodSpotTypes.length} categories`
              : ''}
        </Text>

        {errorMessage && (
          <Text style={[styles.errorText, { color: theme.error ?? 'red' }]}>
            {errorMessage}
          </Text>
        )}
      </View>

      <Button
        onPress={handleNext}
        label="Next"
        color={theme.white}
        backgroundColor={theme.primary}
        style={{ width: '100%', paddingVertical: 15 }}
        size="large"
        // disabled={foodSpotTypes.length === 0} TODO : enable later
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
