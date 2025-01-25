import React, { createContext, useContext, useState } from 'react';
import Notification from '@components/Notification';

export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'status'
  | 'checkOut'
  | 'checkIn';

interface NotificationContextType {
  showNotification: ({
    message,
    type,
    duration,
  }: {
    message: React.ReactNode;
    type: NotificationType;
    duration?: number;
  }) => void;
  closeNotification: (id: string) => void;
}

interface NotificationState {
  id: string;
  message: React.ReactNode;
  type: NotificationType;
  duration: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [closingNotifications, setClosingNotifications] = useState<
    Record<string, boolean>
  >({});

  const showNotification = ({
    message,
    type,
    duration = 5000,
  }: {
    message: React.ReactNode;
    type: NotificationType;
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationState = { id, message, type, duration };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => closeNotification(id), duration);
  };

  const closeNotification = (id: string) => {
    setClosingNotifications((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );
      setClosingNotifications((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }, 300);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, closeNotification }}
    >
      {children}
      <div className="fixed bottom-4 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 transform flex-col space-y-3 sm:bottom-6 sm:left-4 sm:translate-x-0">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${
              closingNotifications[notification.id]
                ? 'animate-slide-out'
                : 'animate-slide-in'
            }`}
          >
            <Notification
              id={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={closeNotification}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};
