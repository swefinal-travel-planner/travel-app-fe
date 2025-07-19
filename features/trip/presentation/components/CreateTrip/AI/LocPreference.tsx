import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import { useAiTripStore } from '@/store/useAiTripStore'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Pressable from '../../../../../../components/Pressable'

type LocPreferenceProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

const descriptions = [
  'The spots will be closer to each other, minimizing travel time.',
  'A balanced approach, with moderate travel between spots and good adherence to your preferences.',
  'The spots will adhere better to your preferences, even if it means traveling further.',
]

// Helper function to convert preference string to index
const getPreferenceIndex = (preference?: string): number => {
  switch (preference) {
    case 'proximity':
      return 0
    case 'relevance':
      return 2
    case 'balanced':
    default:
      return 1
  }
}

// Helper function to convert index to preference string
const getPreferenceString = (index: number): string => {
  switch (index) {
    case 0:
      return 'proximity'
    case 2:
      return 'relevance'
    case 1:
    default:
      return 'balanced'
  }
}

export default function LocPreference({ theme, nextFn }: Readonly<LocPreferenceProps>) {
  const setLocPreference = useAiTripStore((state) => state.setLocPreference)
  const request = useAiTripStore((state) => state.request)

  // 0: proximity, 1: balanced, 2: relevance
  const [preference, setPreference] = useState<number>(getPreferenceIndex(request?.locationPreference))

  useEffect(() => {
    setLocPreference(getPreferenceString(preference))
  }, [preference, setLocPreference])

  const handleNext = () => {
    setLocPreference(getPreferenceString(preference))
    nextFn()
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>How would you like your trip to be prepared?</Text>

      <Text style={[styles.subTextQuestion, { color: theme.text }]}>
        This will change the way our AI finds spots for your trip.
      </Text>

      <View style={styles.textFieldContainer}>
        <SegmentedControl
          values={['Proximity', 'Balanced', 'Relevance']}
          selectedIndex={preference}
          style={{
            width: '100%',
            height: '20%',
            borderRadius: Radius.FULL,
            backgroundColor: theme.background,
          }}
          sliderStyle={{
            borderRadius: Radius.FULL,
            backgroundColor: theme.primary,
          }}
          fontStyle={{ fontFamily: FontFamily.REGULAR, fontSize: FontSize.LG, color: theme.text }}
          activeFontStyle={{
            fontFamily: FontFamily.BOLD,
            fontSize: FontSize.LG,
            color: theme.white,
          }}
          onChange={(event) => {
            setPreference(event.nativeEvent.selectedSegmentIndex)
          }}
        />
      </View>

      <Text style={[styles.textField, { color: theme.primary }]}>{descriptions[preference]}</Text>

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
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
    backgroundColor: '#ffffff',
  },
  textFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '55%',
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
