import { NOTIFICATION_CATEGORY_LABELS } from '@/constants/notificationCategories'
import beApi from '@/lib/beApi'
import { Notification, NotificationCategory } from '@/lib/types/Notification'

export interface NotificationConfig {
  category: NotificationCategory
  label: string
  message: (notification: Notification) => string
  action: 'actionable' | 'navigable'
  navigationPath?: string
  apiEndpoint?: string
}

export const NOTIFICATION_CONFIGS: Record<NotificationCategory, NotificationConfig> = {
  tripGenerated: {
    category: 'tripGenerated',
    label: NOTIFICATION_CATEGORY_LABELS.tripGenerated,
    message: () => 'Your trip is ready! Check it out.',
    action: 'navigable',
    navigationPath: '/my-trips',
  },
  friendRequestReceived: {
    category: 'friendRequestReceived',
    label: NOTIFICATION_CATEGORY_LABELS.friendRequestReceived,
    message: (notification) =>
      `${notification.triggerEntity?.name ?? 'Someone'} sent you a friend request. Swipe right to accept!`,
    action: 'actionable',
    apiEndpoint: '/invitation-friends/accept',
  },
  friendRequestAccepted: {
    category: 'friendRequestAccepted',
    label: NOTIFICATION_CATEGORY_LABELS.friendRequestAccepted,
    message: (notification) => `${notification.triggerEntity?.name ?? 'Someone'} accepted your friend request.`,
    action: 'navigable',
    navigationPath: '/profile',
  },
  tripInvitationReceived: {
    category: 'tripInvitationReceived',
    label: NOTIFICATION_CATEGORY_LABELS.tripInvitationReceived,
    message: (notification) =>
      `${notification.triggerEntity?.name ?? 'Someone'} invited you to join a trip. Swipe right to accept!`,
    action: 'actionable',
    apiEndpoint: '/invitation-trips/accept',
  },
  tripGeneratedFailed: {
    category: 'tripGeneratedFailed',
    label: NOTIFICATION_CATEGORY_LABELS.tripGeneratedFailed,
    message: () => "We're sorry, but your trip couldn't be prepared. Please try again.",
    action: 'navigable',
    navigationPath: '/my-trips',
  },
  tripStartingSoon: {
    category: 'tripStartingSoon',
    label: NOTIFICATION_CATEGORY_LABELS.tripStartingSoon,
    message: () => `Your trip is starting soon! Don't forget to check your itinerary.`,
    action: 'navigable',
    navigationPath: '/my-trips',
  },
}

export class NotificationService {
  static enrichNotifications(rawNotifications: Notification[]): Notification[] {
    return rawNotifications
      .map((notification) => ({
        ...notification,
        referenceData: this.generateMessage(notification),
        action: this.getAction(notification),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static generateMessage(notification: Notification): string {
    const config = NOTIFICATION_CONFIGS[notification.type]
    return config ? config.message(notification) : 'You have a new notification.'
  }

  static getAction(notification: Notification): 'actionable' | 'navigable' {
    const config = NOTIFICATION_CONFIGS[notification.type]
    return config ? config.action : 'navigable'
  }

  static getCategoryLabel(category: NotificationCategory): string {
    return NOTIFICATION_CONFIGS[category]?.label || category
  }

  static getNavigationPath(notification: Notification): string | undefined {
    return NOTIFICATION_CONFIGS[notification.type]?.navigationPath
  }

  static getApiEndpoint(notification: Notification): string | undefined {
    return NOTIFICATION_CONFIGS[notification.type]?.apiEndpoint
  }

  static async fetchNotifications(): Promise<Notification[]> {
    try {
      const response = await beApi.get('/notifications')
      const rawNotifications: Notification[] = response.data.data
      return this.enrichNotifications(rawNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  static async markAsRead(notificationId: number): Promise<void> {
    try {
      await beApi.post(`/notifications/${notificationId}/seen`)
    } catch (error) {
      console.error('Error updating notification state:', error)
    }
  }

  static async acceptRequest(notification: Notification): Promise<void> {
    const endpoint = this.getApiEndpoint(notification)
    if (!endpoint) {
      console.error('No API endpoint configured for this notification type')
      return
    }

    try {
      await beApi.put(`${endpoint}/${notification.referenceEntity.id}`)
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }

  static getAvailableCategories(): NotificationCategory[] {
    return Object.keys(NOTIFICATION_CONFIGS) as NotificationCategory[]
  }

  static filterNotifications(
    notifications: Notification[] | undefined,
    activeCategories: NotificationCategory[]
  ): Notification[] | undefined {
    if (activeCategories.length === 0) {
      return notifications
    }
    return notifications?.filter((notification) => activeCategories.includes(notification.type))
  }
}

export const generateMessage = NotificationService.generateMessage
export const getAction = NotificationService.getAction
export const getNotificationCategoryLabel = NotificationService.getCategoryLabel
