import { NotificationCategory } from '@/lib/types/Notification'

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  tripGenerated: 'AI trip ready',
  friendRequestReceived: 'Friend request',
  friendRequestAccepted: 'Friend request accepted',
  tripInvitationReceived: 'Trip invitation',
  tripGeneratedFailed: 'AI trip failed',
  tripStartingSoon: 'Trip starting soon',
}
