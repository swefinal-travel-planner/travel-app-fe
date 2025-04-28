import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useEffect, useState, ReactNode, Fragment } from 'react'

interface UniversalPickerProps<T> {
  data: T[]
  keyExtractor: (item: T) => string
  labelExtractor: (item: T) => string
  iconExtractor?: (item: T) => any
  initialValue?: T
  onSelect: (item: T) => void
  renderItem?: (item: T, onSelect: () => void) => ReactNode
  placeholder?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

export function UniversalPicker<T>({
  data,
  keyExtractor,
  labelExtractor,
  iconExtractor,
  initialValue,
  onSelect,
  renderItem,
  placeholder = 'Select an option',
  style,
  textStyle,
}: Readonly<UniversalPickerProps<T>>) {
  const [modalVisible, setModalVisible] = useState(false)
  const [selected, setSelected] = useState<T | undefined>(
    initialValue ?? data[0]
  )

  useEffect(() => {
    if (initialValue) setSelected(initialValue)
  }, [initialValue])

  const handleSelect = (item: T) => {
    setSelected(item)
    onSelect(item)
    setModalVisible(false)
  }

  return (
    <View>
      <Pressable
        style={[styles.button, style]}
        onPress={() => setModalVisible(true)}
      >
        {selected && iconExtractor && (
          <Image source={iconExtractor(selected)} style={styles.icon} />
        )}
        <Text style={[styles.text, textStyle]}>
          {selected ? labelExtractor(selected) : placeholder}
        </Text>
        <AntDesign name="down" size={15} />
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => {
                if (renderItem) {
                  return (
                    <Fragment key={keyExtractor(item)}>
                      {renderItem(item, () => handleSelect(item))}
                    </Fragment>
                  )
                }

                return (
                  <Pressable
                    key={keyExtractor(item)}
                    style={styles.item}
                    onPress={() => handleSelect(item)}
                  >
                    {iconExtractor && (
                      <Image
                        source={iconExtractor(item)}
                        style={styles.iconSmall}
                      />
                    )}
                    <Text style={styles.label}>{labelExtractor(item)}</Text>
                  </Pressable>
                )
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
    resizeMode: 'contain',
  },
  iconSmall: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    backgroundColor: 'white',
    width: '100%',
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
  },
})
