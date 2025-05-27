import React from 'react'
import { View, StyleSheet } from 'react-native'

export const DebugWrapper = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.debug}>{children}</View>
}

const styles = StyleSheet.create({
  debug: {
    borderWidth: 1,
    borderColor: 'red',
  },
})
