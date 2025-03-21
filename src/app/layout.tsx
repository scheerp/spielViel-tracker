'use client';

import localFont from 'next/font/local';
import './globals.css';
import Header from '@components/Header';
import AppProviders from '@context/AppProviders';
import FeedbackBanner from '@components/FeedbackBanner';

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
        <AppProviders>
          <Header />
          <FeedbackBanner />
          <main className="pt-20">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
