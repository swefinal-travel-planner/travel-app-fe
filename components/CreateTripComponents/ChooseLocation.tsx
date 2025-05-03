import { colorPalettes } from '@/styles/Itheme'
import React from 'react'
import { Button, Text, View } from 'react-native-ui-lib'

type ChooseLocationProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function ChooseLocation({
  theme,
  nextFn,
}: Readonly<ChooseLocationProps>) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Choose Location</Text>
      <Button onPress={nextFn} label="Next" color={theme.primary}></Button>
    </View>
  )
}
