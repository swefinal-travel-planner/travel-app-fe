export type Place = {
  id: string
  address: string
  images: string[]
  location: {
    lat: number
    long: number
  }
  name: string
  properties: string[]
  type: string
}
