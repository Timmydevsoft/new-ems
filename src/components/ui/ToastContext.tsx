import * as React from 'react';
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from './Toast';
import { useAppStore } from '../../store';

interface ToastContextType {
  addToast: (title: string, description?: string, variant?: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProviderWrapper() {
  const { toasts, addToast, removeToast } = useAppStore();

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastProvider>
        {toasts.map((toast) => {
          let variant: 'success' | 'warning' | 'default' | 'destructive' = 'default';
          switch (toast.type) {
            case 'success':
              variant = 'success';
              break;
            case 'error':
              variant = 'destructive';
              break;
            case 'warning':
              variant = 'warning';
              break;
            case 'info':
              variant = 'default';
              break;
          }
          return (
            <Toast key={toast.id} variant={variant}>
              <div className="grid gap-1">
                <ToastTitle>{toast.title}</ToastTitle>
                {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
              </div>
              <ToastClose onClick={() => removeToast(toast.id)} />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}
