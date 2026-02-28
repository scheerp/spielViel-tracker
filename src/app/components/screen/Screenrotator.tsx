'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgramSlide from './slides/ProgramSlide';
import OpenPlayersearchSlide from './slides/OpenPlayersearchSlide';
import TopGamesSlide from './slides/TopGamesSlide';
import { SlidesData } from './ScreenRotatorWrapper';
import { Game } from '@context/GamesContext';
import { Session } from '@components/ProgramCard';
import { FlatPlayerSearchWithGame } from '@context/PlayerSearchContext';

type ProgramSlideType = {
  id: 'program';
  component: typeof ProgramSlide;
  data: Record<string, Session>;
  duration: number;
};

type OpenGamesSlideType = {
  id: 'open-games';
  component: typeof OpenPlayersearchSlide;
  data: FlatPlayerSearchWithGame[];
  duration: number;
};

type TopGamesSlideType = {
  id: 'top-games';
  component: typeof TopGamesSlide;
  data: Game[];
  duration: number;
};

type Slide = ProgramSlideType | OpenGamesSlideType | TopGamesSlideType;

const DEFAULT_DURATION = 10 * 1000; // 10 Sekunden

export default function ScreenRotator({
  slidesData,
  onCompleteRound,
}: {
  slidesData: SlidesData;
  onCompleteRound?: () => void;
}) {
  const [index, setIndex] = useState(0);

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: 'program',
        component: ProgramSlide,
        data: slidesData.program,
        duration: 3 * 1000,
      },
      {
        id: 'open-games',
        component: OpenPlayersearchSlide,
        data: slidesData.openGames,
        duration: 3 * 1000,
      },
      {
        id: 'top-games',
        component: TopGamesSlide,
        data: slidesData.topGames,
        duration: 10000 * 1000,
      },
    ],
    [slidesData],
  );

  const goToSlide = useCallback(
    (newIndex: number) => {
      const nextIndex = (newIndex + slides.length) % slides.length;

      // Wenn wir wieder zum ersten Slide springen -> komplette Runde vorbei
      if (newIndex >= slides.length && onCompleteRound) {
        onCompleteRound();
      }

      setIndex(nextIndex);
    },
    [slides.length, onCompleteRound],
  );

  useEffect(() => {
    setIndex(0);
  }, [slidesData]);

  // Pfeiltasten navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToSlide(index + 1);
      if (e.key === 'ArrowLeft') goToSlide(index - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, goToSlide]);

  const currentSlide = slides[index];

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
          {currentSlide.id === 'program' && (
            <ProgramSlide data={currentSlide.data} />
          )}

          {currentSlide.id === 'open-games' && (
            <OpenPlayersearchSlide data={currentSlide.data} />
          )}

          {currentSlide.id === 'top-games' && (
            <TopGamesSlide data={currentSlide.data} />
          )}
          {/* Ladebalken */}
          <motion.div
            className="fixed bottom-0 left-0 h-1 w-full origin-left bg-primary"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{
              duration: currentSlide.duration / 1000,
              ease: 'linear',
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
