import Header from '@components/Header';
import FeedbackBanner from '@components/FeedbackBanner';
import Footer from '@components/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <FeedbackBanner />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </>
  );
}
