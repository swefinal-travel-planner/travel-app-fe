import { FontFamily, FontSize } from '@/constants/font'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { ErrorStateProps, LoadingFooterProps, LoadingStateProps } from '../types'

export const LoadingState: React.FC<LoadingStateProps> = ({ theme }) => {
  const styles = createStyles(theme)

  return (
    <View style={styles.centerContent}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  )
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, theme }) => {
  const styles = createStyles(theme)

  return (
    <View style={styles.centerContent}>
      <Text style={styles.errorText}>Error loading places: {error.message}</Text>
    </View>
  )
}

export const LoadingFooter: React.FC<LoadingFooterProps> = ({ theme }) => {
  const styles = createStyles(theme)

  return (
    <View style={styles.loadingFooter}>
      <Text style={styles.loadingText}>Loading more places...</Text>
    </View>
  )
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.error || 'red',
      textAlign: 'center',
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.MD,
    },
    loadingFooter: {
      padding: 10,
      alignItems: 'center',
    },
    loadingText: {
      color: theme.dimText,
      fontFamily: FontFamily.REGULAR,
      fontSize: FontSize.SM,
    },
  })
