export type NotificationType = 'navigable' | 'actionable'

export type NotificationCategory =
  | 'tripGenerated'
  | 'friendRequestReceived'
  | 'friendRequestAccepted'
  | 'tripInvitationReceived'
  | 'tripGeneratedFailed'

type referenceEntity = {
  id: number
  type: NotificationCategory
}

type triggerEntity = {
  id: number
  avatar: string
  name: string
  type: string
}

export interface Notification {
  id: number
  createdAt: string
  isSeen: boolean
  referenceData: string
  referenceEntity: referenceEntity
  triggerEntity: triggerEntity
  type: NotificationType
}
