export interface SpotData {
  id: string
  location: Location
  name: string
  properties: string[]
  type: string[]
  images: string[]
  isSaved: boolean
  address: string
}

interface Location {
  long: number
  lat: number
}
