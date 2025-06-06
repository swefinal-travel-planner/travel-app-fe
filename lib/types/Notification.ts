export type NotificationType = 'navigable' | 'actionable'

export type NotificationCategory =
  | 'friends'
  | 'locations'
  | 'trips'
  | 'reminders'
  | 'weather'

export interface Notification {
  id: number
  title: string
  message: string
  type: NotificationType
  category: NotificationCategory
  date: string
  time: string
  sender: string
  senderAvatar: string
  unread: boolean
}
