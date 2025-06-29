import React, { createContext, useCallback, useContext, useState } from 'react'
import { View } from 'react-native'
import Toast, { ToastProps } from './Toast'

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'onClose'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null)

  const showToast = useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    setToast(toast)
  }, [])

  const handleClose = () => setToast(null)

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast && <Toast {...toast} onClose={handleClose} />}
      </View>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
