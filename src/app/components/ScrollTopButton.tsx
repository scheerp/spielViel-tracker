import ArrowUpIcon from '@icons/ArrowUpIcon';
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
        className="hover:bg-primary-dark z-15 fixed bottom-7 right-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-primaryLight md:bottom-8 md:right-7 md:h-20 md:w-20"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon
          tailwindColor="text-white"
          className="h-7 w-7 md:h-9 md:w-9"
        />
      </button>
    );

  return null;
};

export default ScrollToTopButton;
