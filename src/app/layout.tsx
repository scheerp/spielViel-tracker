'use client';

import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Header from '@components/Header';
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
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NotificationProvider>
            <Header />
            <main>{children}</main>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
