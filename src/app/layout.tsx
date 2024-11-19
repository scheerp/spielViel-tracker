'use client';

import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Header from '@components/Header';
import { useState } from 'react';
import Notification from '@components/Notification';
import { NotificationProvider } from '@context/NotificationContext';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'status';
  } | null>(null);

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Header />
          <NotificationProvider>
            {children}
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
