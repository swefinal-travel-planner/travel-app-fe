import { colorPalettes } from '@/constants/Itheme'
import { useThemeStyle } from '@/hooks/useThemeStyle'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { uploadImage2Cloud } from '@/utils/uploadImage2Cloud'

export default function AlbumScreen() {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  const router = useRouter()

  // Sample data for the album images
  const albumItems = [
    { id: '1', title: 'Catch turtle', imageUrl: null },
    { id: '2', title: 'Catch turtle', imageUrl: null },
    { id: '3', title: 'Catch turtle', imageUrl: null },
    { id: '4', title: 'Catch turtle', imageUrl: null },
    { id: '5', title: 'Catch turtle', imageUrl: null },
  ]

  const handleAddPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
    })

    console.log('ImagePicker result:', result)

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri
      const uploadedUrl = await uploadImage2Cloud(imageUri, 'ml_default')

      if (uploadedUrl !== null) {
        console.log('Image uploaded to:', uploadedUrl)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Album grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.albumGrid}>
          {/* Album items */}
          {albumItems.map((item) => (
            <View key={item.id} style={styles.albumItem}>
              <TouchableOpacity style={styles.imageContainer}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Image source={require('@/assets/images/alligator.jpg')} style={styles.placeholderImage} />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.imageTitle}>{item.title}</Text>
            </View>
          ))}

          {/* Add photo button */}
          <View style={styles.albumItem}>
            <TouchableOpacity style={[styles.imageContainer, styles.addPhotoButton]} onPress={handleAddPhoto}>
              <View style={styles.addPhotoBorder}>
                <Ionicons name="add" size={24} color="#000" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (theme: typeof colorPalettes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 22,
    },
    scrollView: {
      flex: 1,
      paddingVertical: 16,
    },
    albumGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    albumItem: {
      width: '30%',
      marginBottom: 24,
    },
    imageContainer: {
      aspectRatio: 0.75,
      backgroundColor: '#E8DED1',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#A68372',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    imageTitle: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: 12,
      color: '#000000',
    },
    addPhotoBorder: {
      alignSelf: 'center',
      backgroundColor: '#A68372',
      borderRadius: 30,
      padding: 10,
    },
    addPhotoButton: {
      backgroundColor: '#E8DED1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 28,
      fontWeight: '300',
      color: '#8D7B68',
    },
  })
