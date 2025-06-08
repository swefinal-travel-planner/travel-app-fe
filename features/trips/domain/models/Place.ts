export type Place = {
  _id: string
  _index: string
  _score: number | null
  _source: {
    en_name: string
    en_properties: string[]
    en_type: string
    id: string
    lat: number
    long: number
    vi_name: string
    vi_properties: string[]
    vi_type: string
  }
  sort: string[]
}
