import { colorPalettes } from '@/styles/Itheme'
import React from 'react'
import { Button, View, Text } from 'react-native-ui-lib'

type SpotNumberProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function SpotNumber({
  theme,
  nextFn,
}: Readonly<SpotNumberProps>) {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
      }}
    >
      <Text>Spot Number</Text>
      <Button onPress={nextFn} label="Next" color={theme.primary}></Button>
    </View>
  )
}
