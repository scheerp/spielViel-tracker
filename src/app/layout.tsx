'use client';

import './globals.css';
import Header from '@components/Header';
import AppProviders from '@context/AppProviders';
import FeedbackBanner from '@components/FeedbackBanner';
import { Work_Sans } from 'next/font/google';
import Footer from '@components/Footer';

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
    <html lang="de" className={` ${workSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex min-h-screen flex-col font-work">
        <AppProviders>
          <Header />
          <FeedbackBanner />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
