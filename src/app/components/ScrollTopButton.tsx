import ArrowIcon from '@icons/ArrowIcon';
import { useEffect, useState } from 'react';
import Clickable from './Clickable';

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
      <Clickable
        hasWhiteBorder
        onClick={scrollToTop}
        className="shadow-whiteBottom fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white bg-white text-2xl focus:outline-none md:bottom-8 md:right-7"
        aria-label="Scroll to top"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-foreground bg-primary shadow-darkBottom">
          {' '}
          <ArrowIcon
            direction="up"
            tailwindColor="text-white"
            className="h-6 w-6"
          />
        </div>
      </Clickable>
    );

  return null;
};

export default ScrollToTopButton;
