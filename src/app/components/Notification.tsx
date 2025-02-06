'use client';

import React from 'react';
import { NotificationType } from '@context/NotificationContext';

interface NotificationProps {
  id: string;
  message?: React.ReactNode;
  type: NotificationType;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  message,
  type,
  onClose,
}) => {
  const notificationStyles = {
    success: 'bg-quaternary text-white',
    error: 'bg-error text-white',
    warning: 'bg-quinary text-black',
    status: 'bg-status text-white',
    checkOut: 'bg-secondary text-white',
    checkIn: 'bg-tertiary text-white',
  };

  return (
    <div
      className={`relative z-50 w-full rounded-xl p-4 shadow-lg ${notificationStyles[type]}`}
    >
      <div className="flex items-center justify-between">
        {message}
        <button
          onClick={() => onClose(id)}
          className="ml-4 font-bold text-white"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
