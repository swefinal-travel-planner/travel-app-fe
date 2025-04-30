import SearchTextField from '@/components/SearchTextField'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styles from '../styles'
import Trip from '@/components/Trip'
import { apiGetTrips } from '@/api/trips/ApiManualTrip'
import { useQuery } from '@tanstack/react-query'
import { ITrip } from '@/types/Trip/Trip'

export default function MyTrips() {
  const { t } = useTranslation()

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
    <View style={styles.mainContainer}>
      <SearchTextField
        leftIcon="search"
        placeholder={t('myTrip.searchTextInput.placeholder')}
        value="hello"
        onChange={setSearchQuery}
      />
      {trips?.map((trip) => <Trip key={trip.id} trip={trip} />)}
    </View>
  )
}
