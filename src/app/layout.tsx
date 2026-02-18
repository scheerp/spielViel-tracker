// @ts-expect-error - This is a workaround to avoid a hydration mismatch due to the use of CSS variables for theming. The actual type of the imported font is not important for this component, and this prevents TypeScript errors without affecting functionality.
import './globals.css';
import Header from '@components/Header';
import AppProviders from '@context/AppProviders';
import FeedbackBanner from '@components/FeedbackBanner';
import Footer from '@components/Footer';
import localFont from 'next/font/local';

const mainFont = localFont({
  src: './fonts/Fredoka-VariableFont_wdth,wght.ttf',
  variable: '--font-main',
});

export const metadata = {
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={mainFont.variable}>
      <body className="font-main flex min-h-screen flex-col">
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
