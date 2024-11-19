import React, { createContext, useContext, useState, useEffect } from 'react';
import Notification from '@components/Notification';

type NotificationType = 'success' | 'error' | 'warning' | 'status';

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
  closeNotification: () => void;
}

interface NotificationState {
  message: React.ReactNode;
  type: NotificationType;
  duration?: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = ({
    message,
    type,
    duration = 5000,
  }: {
    message: React.ReactNode;
    type: NotificationType;
    duration?: number;
  }) => {
    setNotification({ message, type, duration });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, closeNotification }}
    >
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
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
