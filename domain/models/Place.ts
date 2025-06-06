export type Place = {
  _id: string
  _index: string
  _score: number | null
  _source: {
    en_name: string
    en_properties: string[]
    en_type: string
    id: string
  }
  sort: string[]
}
