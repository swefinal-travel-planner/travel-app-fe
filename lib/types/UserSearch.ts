export type User = {
  id: number
  email: string
  username: string
  avatar?: string
}

export type SearchResult = User & {
  isInvited: boolean
  isCompanion: boolean
}

export type FriendSearchResult = User & {
  isInvited: boolean
  isFriend: boolean
}
