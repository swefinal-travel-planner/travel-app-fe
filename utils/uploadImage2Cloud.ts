import cloudApi from '@/lib/cloudApi'

export const uploadImage2Cloud = async (uri: string, uploadPreset: string): Promise<string | null> => {
  try {
    const formData = new FormData()

    formData.append('file', {
      uri,
      name: uri.split('/').pop() ?? 'image.jpg',
      type: 'image/jpeg',
      folder: 'trip_images',
    } as any)

    formData.append('upload_preset', uploadPreset)

    const response = await cloudApi.post(`/dt8neu8lq/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const data = await response.data
    if (data.url) {
      return data.url
    } else {
      console.error('Upload failed:', data)
      return null
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return null
  }
}
