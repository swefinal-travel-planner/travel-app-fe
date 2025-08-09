const typeGroupIcons: Record<string, { iconSource: any; label: string }> = {
  'Camping & Resort': {
    iconSource: require('@/assets/icons/types/camping_resort.png'),
    label: 'Camping & Resort',
  },
  'Culture & Arts': {
    iconSource: require('@/assets/icons/types/culture_arts.png'),
    label: 'Culture & Arts',
  },
  Entertainment: {
    iconSource: require('@/assets/icons/types/entertainment.png'),
    label: 'Entertainment',
  },
  'Food & Drink': {
    iconSource: require('@/assets/icons/types/food_drink.png'),
    label: 'Food & Drink',
  },
  'History & Landmarks': {
    iconSource: require('@/assets/icons/types/history_landmarks.png'),
    label: 'History & Landmarks',
  },
  Nature: {
    iconSource: require('@/assets/icons/types/nature.png'),
    label: 'Nature',
  },
  'Outdoor Activities': {
    iconSource: require('@/assets/icons/types/outdoor_activities.png'),
    label: 'Outdoor Activities',
  },
  Shopping: {
    iconSource: require('@/assets/icons/types/shopping.png'),
    label: 'Shopping',
  },
  'Spa & Wellness': {
    iconSource: require('@/assets/icons/types/spa_wellness.png'),
    label: 'Spa & Wellness',
  },
  'Tourism Services': {
    iconSource: require('@/assets/icons/types/tourism_services.png'),
    label: 'Tourism Services',
  },
}

const typeToGroupMap: Record<string, string> = {
  // Camping & Resort
  camp_pitch: 'Camping & Resort',
  camp_site: 'Camping & Resort',
  summer_camp: 'Camping & Resort',
  caravan_site: 'Camping & Resort',
  'beach.beach_resort': 'Camping & Resort',

  // Culture & Arts
  library: 'Culture & Arts',
  culture: 'Culture & Arts',
  theatre: 'Culture & Arts',
  arts_centre: 'Culture & Arts',
  gallery: 'Culture & Arts',
  cultural_experience: 'Culture & Arts',

  // Entertainment
  entertainment: 'Entertainment',
  zoo: 'Entertainment',
  aquarium: 'Entertainment',
  museum: 'Entertainment',
  cinema: 'Entertainment',
  amusement_arcade: 'Entertainment',
  escape_game: 'Entertainment',
  miniature_golf: 'Entertainment',
  bowling_alley: 'Entertainment',
  flying_fox: 'Entertainment',
  theme_park: 'Entertainment',
  water_park: 'Entertainment',
  activity_park: 'Entertainment',
  nightclub: 'Entertainment',
  casino: 'Entertainment',
  adult_gaming_centre: 'Entertainment',

  // Food & Drink
  bakery: 'Food & Drink',
  deli: 'Food & Drink',
  pasta: 'Food & Drink',
  ice_cream: 'Food & Drink',
  seafood: 'Food & Drink',
  fruit_and_vegetable: 'Food & Drink',
  farm: 'Food & Drink',
  confectionery: 'Food & Drink',
  chocolate: 'Food & Drink',
  'food location': 'Food & Drink',
  drinks: 'Food & Drink',
  coffee_and_tea: 'Food & Drink',
  restaurant: 'Food & Drink',
  cafe: 'Food & Drink',
  bar: 'Food & Drink',
  pub: 'Food & Drink',
  biergarten: 'Food & Drink',
  taproom: 'Food & Drink',
  street_food: 'Food & Drink',
  food_court: 'Food & Drink',
  local_cuisine: 'Food & Drink',
  fine_dining: 'Food & Drink',
  buffet: 'Food & Drink',
  hot_pot: 'Food & Drink',
  bbq: 'Food & Drink',
  seafood_restaurant: 'Food & Drink',
  vegetarian: 'Food & Drink',
  vegan: 'Food & Drink',
  fast_food: 'Food & Drink',
  food_truck: 'Food & Drink',
  teahouse: 'Food & Drink',
  dessert_shop: 'Food & Drink',
  noodle_shop: 'Food & Drink',
  sushi_bar: 'Food & Drink',
  korean_bbq: 'Food & Drink',
  ramen: 'Food & Drink',
  craft_beer: 'Food & Drink',

  // History & Landmarks
  historic: 'History & Landmarks',
  'heritage.unesco': 'History & Landmarks',
  sights: 'History & Landmarks',
  attraction: 'History & Landmarks',
  place_of_worship: 'History & Landmarks',
  monastery: 'History & Landmarks',
  city_hall: 'History & Landmarks',
  lighthouse: 'History & Landmarks',
  windmill: 'History & Landmarks',
  tower: 'History & Landmarks',
  battlefield: 'History & Landmarks',
  fort: 'History & Landmarks',
  castle: 'History & Landmarks',
  ruines: 'History & Landmarks',
  archaeological_site: 'History & Landmarks',
  city_gate: 'History & Landmarks',
  bridge: 'History & Landmarks',
  memorial: 'History & Landmarks',

  // Nature
  park: 'Nature',
  forest: 'Nature',
  spring: 'Nature',
  reef: 'Nature',
  hot_spring: 'Nature',
  sea: 'Nature',
  mountain: 'Nature',
  peak: 'Nature',
  cave_entrance: 'Nature',
  sand: 'Nature',
  protected_area: 'Nature',
  national_park: 'Nature',

  // Outdoor Activities
  picnic: 'Outdoor Activities',
  playground: 'Outdoor Activities',
  viewpoint: 'Outdoor Activities',
  trailhead: 'Outdoor Activities',
  hiking_route: 'Outdoor Activities',
  bike_tour: 'Outdoor Activities',
  eco_tourism: 'Outdoor Activities',
  farm_experience: 'Outdoor Activities',
  vineyard: 'Outdoor Activities',
  photospot: 'Outdoor Activities',
  sunset_point: 'Outdoor Activities',

  // Shopping
  commercial: 'Shopping',
  supermarket: 'Shopping',
  marketplace: 'Shopping',
  shopping_mall: 'Shopping',
  department_store: 'Shopping',
  outdoor_and_sport: 'Shopping',
  hobby: 'Shopping',
  books: 'Shopping',
  gift_and_souvenir: 'Shopping',
  stationery: 'Shopping',
  clothing: 'Shopping',
  garden: 'Shopping',
  florist: 'Shopping',
  discount_store: 'Shopping',
  jewelry: 'Shopping',
  watches: 'Shopping',
  art: 'Shopping',
  antiques: 'Shopping',
  trade: 'Shopping',
  kiosk: 'Shopping',

  // Spa & Wellness
  spa: 'Spa & Wellness',
  public_bath: 'Spa & Wellness',
  sauna: 'Spa & Wellness',
  massage: 'Spa & Wellness',

  // Tourism Services
  tourism: 'Tourism Services',
  boat_tour: 'Tourism Services',
  winery: 'Tourism Services',
  brewery: 'Tourism Services',
  distillery: 'Tourism Services',
  local_market: 'Tourism Services',
  handicraft_village: 'Tourism Services',
  floating_market: 'Tourism Services',
  night_market: 'Tourism Services',
}

export const getGroupIconsFromTypes = (typesStr: string) => {
  const typeArray = typesStr.split(',').map((t) => t.trim())
  const groups = new Set<string>()

  typeArray.forEach((type) => {
    const group = typeToGroupMap[type]
    if (group) {
      groups.add(group)
    }
  })

  return Array.from(groups).map((group) => ({
    ...typeGroupIcons[group],
    key: group,
  }))
}

// Default time spent (in minutes) per GROUP (re-uses existing typeToGroupMap)
export const groupToFixedMinutes: Record<string, number> = {
  'Camping & Resort': 60, // 1.0h
  'Culture & Arts': 30, // 0.5h
  Entertainment: 60, // 1.0h
  'Food & Drink': 30, // 0.5h
  'History & Landmarks': 30, // 0.5h
  Nature: 60, // 1.0h
  'Outdoor Activities': 60, // 1.0h
  Shopping: 30, // 0.5h
  'Spa & Wellness': 60, // 1.0h
  'Tourism Services': 30, // 0.5h
}

// Removed randomness; we now use a fixed duration per group

// Derive a default time spent from a comma-separated types string
// Strategy: map leaf types to groups, then take the max group default
export const getDefaultTimeSpentFromTypes = (typesStr: string, fallbackMinutes = 60): number => {
  if (!typesStr) return fallbackMinutes
  const types = typesStr.split(',').map((t) => t.trim())
  const groups = new Set<string>()
  for (const type of types) {
    const group = typeToGroupMap[type]
    if (group) groups.add(group)
  }
  if (groups.size === 0) return fallbackMinutes
  let best: number | undefined
  Array.from(groups).forEach((group) => {
    const fixed = groupToFixedMinutes[group]
    if (typeof fixed !== 'number') return
    best = typeof best === 'number' ? Math.max(best, fixed) : fixed
  })
  return typeof best === 'number' ? best : fallbackMinutes
}
