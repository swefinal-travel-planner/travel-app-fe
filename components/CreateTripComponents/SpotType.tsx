import { colorPalettes } from '@/styles/Itheme'
import React from 'react'
import { Button, View, Text } from 'react-native-ui-lib'

type SpotTypeProps = {
  theme: typeof colorPalettes.light
  nextFn: () => void
}

export default function SpotType({ theme, nextFn }: Readonly<SpotTypeProps>) {
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
      <Text>Spot Type</Text>
      <Button onPress={nextFn} label="Next" color={theme.primary}></Button>
    </View>
  )
}
