import { BE_URL } from '@/lib/beApi'
import { CORE_URL } from '@/lib/coreApi'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default function ServerDown() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚫</Text>
      <Text style={styles.title}>Unable to Connect</Text>
      <Text style={styles.message}>
        We’re currently unable to reach the server. Please check your internet connection or try again later.
      </Text>
      <Text style={styles.message}>The backend server is on {BE_URL}</Text>
      <Text style={styles.message}>The core server is on {CORE_URL}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
})
