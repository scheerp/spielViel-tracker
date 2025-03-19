import ArrowLeftIcon from '@icons/ArrowLeftIcon';
import { useEffect, useState } from 'react';

const ScrollToTopButton: React.FC = () => {
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showScrollToTop)
    return (
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl shadow-[0_8px_15px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-primaryLight md:bottom-8 md:right-7"
        aria-label="Scroll to top"
      >
        <div className="flex h-8 w-8 rotate-90 items-center justify-center rounded-full bg-primary">
          <ArrowLeftIcon tailwindColor="text-white" className="h-8 w-8" />
        </div>
      </button>
    );

  return null;
};

export default ScrollToTopButton;
