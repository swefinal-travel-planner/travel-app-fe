import { FontFamily, FontSize } from '@/constants/font'
import { colorPalettes } from '@/constants/Itheme'
import { Radius } from '@/constants/theme'
import beApi, { BE_URL } from '@/lib/beApi'
import { AiTripRequest, useAiTripStore } from '@/store/useAiTripStore'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Pressable from '../Pressable'

type LocPreferenceProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

const descriptions = [
  'The spots will be closer to each other, minimizing travel time.',
  'A balanced approach, with moderate travel between spots and good adherence to your preferences.',
  'The spots will adhere better to your preferences, even if it means traveling further.',
]

export default function LocPreference({
  theme,
  nextFn,
}: Readonly<LocPreferenceProps>) {
  const setLocPreference = useAiTripStore((state) => state.setLocPreference)
  const setTripCreated = useAiTripStore((state) => state.setTripCreated)
  const request = useAiTripStore((state) => state.request)

  // 0: proximity, 1: balanced, 2: distance
  const [preference, setPreference] = useState<number>(
    request?.locationPreference === 'proximity'
      ? 0
      : request?.locationPreference === 'relevance'
        ? 2
        : 1
  )

  const submitTrip = async (payload: AiTripRequest) => {
    try {
      setLocPreference(
        preference === 0
          ? 'proximity'
          : preference === 1
            ? 'balanced'
            : 'relevance'
      )

      payload = {
        ...payload,
        startDate: new Date(payload.startDate).toISOString(),
      }

      setTripCreated(false)

      console.log(payload)

      await beApi.post(`${BE_URL}/trips/ai`, payload)

      nextFn()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle errors coming from the API call
        console.error('API error:', error.response?.data || error.message)
      } else {
        console.error('AI trip creation error:', error)
      }
    }
  }

  useEffect(() => {
    setLocPreference(
      preference === 0
        ? 'proximity'
        : preference === 1
          ? 'balanced'
          : 'relevance'
    )
  }, [preference])

  return (
    <View style={styles.container}>
      <Text style={[styles.textQuestion, { color: theme.primary }]}>
        How would you like your trip to be prepared?
      </Text>

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
          fontStyle={{ fontFamily: FontFamily.REGULAR, fontSize: FontSize.LG }}
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

      <Text style={[styles.textField, { color: theme.primary }]}>
        {descriptions[preference]}
      </Text>

      <Pressable
        onPress={() => request && submitTrip(request)}
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
