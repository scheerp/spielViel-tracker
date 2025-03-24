'use client';

import './globals.css';
import Header from '@components/Header';
import AppProviders from '@context/AppProviders';
import FeedbackBanner from '@components/FeedbackBanner';
import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${workSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-work">
        <AppProviders>
          <Header />
          <FeedbackBanner />
          <main className="pt-20">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
