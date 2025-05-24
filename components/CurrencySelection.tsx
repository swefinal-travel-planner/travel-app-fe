import { useThemeStyle } from '@/hooks/useThemeStyle'
import { colorPalettes } from '@/styles/Itheme'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useEffect, useMemo, useState } from 'react'
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Currencies from '../constants/currencies'

type Currency = (typeof Currencies)[number]

interface CurrencySelectionProps {
  onSelect: (currency: Currency) => void
  initial?: (typeof Currencies)[number]
}

export default function CurrencySelection({
  onSelect,
  initial,
}: Readonly<CurrencySelectionProps>) {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    initial || Currencies[0]
  )

  useEffect(() => {
    if (initial) {
      setSelectedCurrency(initial)
    }
  }, [initial])

  return (
    <View>
      {/* Button to open modal */}
      <Pressable
        style={styles.selectCurrencyButton}
        onPress={() => setModalVisible(true)}
      >
        <Image source={selectedCurrency.image} style={styles.flagIcon} />
        <Text style={styles.buttonText}>
          {selectedCurrency.abbreviation.toUpperCase()}
        </Text>
        <AntDesign name="down" size={15} />
      </Pressable>

      {/* Modal for selecting currency */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={Currencies}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.currencyItem}
                  onPress={() => {
                    setSelectedCurrency(item)
                    onSelect(item)
                    setModalVisible(false)
                  }}
                >
                  <Image source={item.image} style={styles.flagItemIcon} />
                  <Text style={styles.currencyText}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    selectCurrencyButton: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },

    flagIcon: {
      width: 40,
      height: 40,
      marginRight: 10,
    },
    buttonText: {
      fontSize: 20,
      marginRight: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      width: '100%',
    },
    currencyItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      flexDirection: 'row',
      alignItems: 'center',
    },
    currencyText: {
      fontSize: 18,
    },

    flagItemIcon: {
      width: 30,
      height: 30,
      marginRight: 15,
    },
  })
