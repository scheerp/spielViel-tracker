'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgramSlide from './slides/ProgramSlide';
import OpenPlayersearchSlide from './slides/OpenPlayersearchSlide';
import { Game } from '@context/GamesContext';
import TopGamesSlide from './slides/TopGamesSlide';

type SlidesData = {
  topGames?: Game[];
};

type Slide = {
  id: string;
  component: React.ComponentType<{ data?: any }>;
  data?: any;
  duration: number;
};

type Props = { slidesData: SlidesData };

export default function ScreenRotator({ slidesData }: Props) {
  const slides: Slide[] = [
    {
      id: 'program',
      component: ProgramSlide,
      duration: 20000,
    },
    {
      id: 'open-games',
      component: OpenPlayersearchSlide,
      duration: 20000,
    },
    {
      id: 'top-games',
      component: TopGamesSlide,
      data: slidesData.topGames || [],
      duration: 20000,
    },
  ];

  const [index, setIndex] = useState(0);

  const goToSlide = useCallback(
    (newIndex: number) => setIndex((newIndex + slides.length) % slides.length),
    [],
  );

  // Pfeiltasten
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToSlide(index + 1);
      if (e.key === 'ArrowLeft') goToSlide(index - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, goToSlide]);

  const currentSlide = slides[index];
  const SlideComponent = currentSlide.component;

  // Autoplay
  useEffect(() => {
    const timeout = setTimeout(
      () => goToSlide(index + 1),
      currentSlide.duration,
    );
    return () => clearTimeout(timeout);
  }, [index, currentSlide.duration, goToSlide]);

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          className="absolute left-0 top-0 h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SlideComponent data={currentSlide.data} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
