export interface Trip {
  id: string
  image: string
  title: string
  city: string
  start_date: string
  days: number
  budget: number
  num_members: number
  location_attributes: string[]
  food_attributes: string[]
  special_requirements: string[]
  medical_conditions: string[]
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  pinned: boolean
}
