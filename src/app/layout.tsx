import './globals.css';
import AppProviders from '@context/AppProviders';
import localFont from 'next/font/local';

const mainFont = localFont({
  src: './fonts/Fredoka-VariableFont_wdth,wght.ttf',
  variable: '--font-main',
  preload: false,
});

export const metadata = {
  manifest: '/manifest.json',

  appleWebApp: {
    capable: true,
    title: 'Spiel Viel',
    statusBarStyle: 'default',
  },

  icons: {
    apple: '/ios/apple-icon-180x180.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${mainFont.variable} font-main`}>
      <body className="flex min-h-screen flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
