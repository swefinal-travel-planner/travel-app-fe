import { useState, useEffect, useCallback } from 'react'
import { Notification, NotificationCategory } from '@/lib/types/Notification'
import { NotificationService } from '@/services/notificationService'

export interface UseNotificationsReturn {
  notifications: Notification[] | undefined
  activeCategories: NotificationCategory[]
  isLoading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  removeNotification: (id: number) => void
  markAsRead: (id: number) => void
  acceptRequest: (notification: Notification) => Promise<void>
  setActiveCategories: (categories: NotificationCategory[]) => void
  filteredNotifications: Notification[] | undefined
  availableCategories: NotificationCategory[]
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>()
  const [activeCategories, setActiveCategories] = useState<NotificationCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableCategories = NotificationService.getAvailableCategories()

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const enrichedNotifications = await NotificationService.fetchNotifications()
      setNotifications(enrichedNotifications)
    } catch (err) {
      setError('Failed to fetch notifications')
      console.error('Error in fetchNotifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev?.filter((notification) => notification.id !== id))
  }, [])

  const markAsRead = useCallback(async (id: number) => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev?.map((notification) => (notification.id === id ? { ...notification, isSeen: true } : notification))
    )

    // Update backend
    await NotificationService.markAsRead(id)
  }, [])

  const acceptRequest = useCallback(
    async (notification: Notification) => {
      // Mark as read first
      await markAsRead(notification.id)

      // Accept the request
      await NotificationService.acceptRequest(notification)
    },
    [markAsRead]
  )

  const filteredNotifications = NotificationService.filterNotifications(notifications, activeCategories)

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    activeCategories,
    isLoading,
    error,
    fetchNotifications,
    removeNotification,
    markAsRead,
    acceptRequest,
    setActiveCategories,
    filteredNotifications,
    availableCategories,
  }
}
