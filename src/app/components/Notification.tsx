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
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    status: 'bg-blue-500 text-white',
    checkOut: 'bg-checkedOut text-white',
    checkIn: 'bg-checkedIn text-white',
  };

  return (
    <div
      className={`relative w-full rounded-lg p-4 shadow-lg ${notificationStyles[type]}`}
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
