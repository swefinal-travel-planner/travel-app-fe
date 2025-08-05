import { NotificationCategory } from '@/lib/types/Notification'

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  tripGenerated: 'Trip Generated',
  friendRequestReceived: 'Friend Request',
  friendRequestAccepted: 'Friend Accepted',
  tripInvitationReceived: 'Trip Invitation',
  tripGeneratedFailed: 'Trip Generation Failed',
}
