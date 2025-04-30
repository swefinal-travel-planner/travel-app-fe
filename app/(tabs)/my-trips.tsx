import SearchTextField from '@/components/SearchTextField'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import styles from '../styles'
import Trip from '@/components/Trip'
import { apiGetTrips } from '@/api/trips/ApiManualTrip'
import { useQuery } from '@tanstack/react-query'
import { ITrip } from '@/types/Trip/Trip'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import { Padding, Radius } from '@/constants/theme'

export default function MyTrips() {
  const { t } = useTranslation()
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [searchQuery, setSearchQuery] = useState<string>('')

  const {
    data: trips,
    isLoading,
    error,
  } = useQuery<ITrip[]>({
    queryKey: ['trips', searchQuery],
    queryFn: () => apiGetTrips(searchQuery),
  })

  return (
    <View style={styles.container}>
      <SearchTextField
        leftIcon="search"
        placeholder={t('myTrip.searchTextInput.placeholder')}
        value="hello"
        onChange={setSearchQuery}
      />
      <FlatList
        style={styles.flatList}
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Trip trip={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.NORMAL,
      overflow: 'hidden',
    },
    flatList: {
      width: '100%',
      height: '100%',
      padding: Padding.NORMAL,
      backgroundColor: theme.black,
    },
  })
