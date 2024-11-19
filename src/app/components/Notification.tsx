'use client';

import React from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'status';

interface NotificationProps {
  message?: React.ReactNode;
  type: NotificationType;
  onClose: () => void;
  children?: Readonly<{
    children?: React.ReactNode;
  }>;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const notificationStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    status: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`fixed top-16 z-[2] m-4 w-full max-w-sm rounded-md p-4 shadow-lg ${notificationStyles[type]}`}
    >
      <div className="flex items-center justify-between">
        {message}
        <button onClick={onClose} className="ml-4 font-bold text-white">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
