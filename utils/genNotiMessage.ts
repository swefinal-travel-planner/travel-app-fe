import { Notification } from '@/lib/types/Notification'
export const generateMessage = (notification: Notification): string => {
  const { type } = notification.referenceEntity
  const triggerName = notification.triggerEntity?.name ?? 'Someone'

  switch (type) {
    case 'friendRequestReceived':
      return `${triggerName} sent you a friend request.`
    case 'friendRequestAccepted':
      return `${triggerName} accepted your friend request.`
    case 'tripInvitationReceived':
      return `${triggerName} invited you to join a trip.`
    case 'tripGenerated':
      return 'Your trip has been generated successfully.'
    case 'tripGeneratedFailed':
      return 'Failed to generate your trip. Please try again.'
    default:
      return 'You have a new notification.'
  }
}
