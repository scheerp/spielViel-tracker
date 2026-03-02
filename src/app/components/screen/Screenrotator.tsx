'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgramSlide from './slides/ProgramSlide';
import OpenPlayersearchSlide from './slides/OpenPlayersearchSlide';
import TopGamesSlide from './slides/TopGamesSlide';
import StaticInfoSlide from './slides/StaticInfoSlide';
import { SlidesData } from './ScreenRotatorWrapper';
import { Game } from '@context/GamesContext';
import { Session } from '@components/ProgramCard';
import { FlatPlayerSearchWithGame } from '@context/PlayerSearchContext';
import { useNotification } from '@context/NotificationContext';

type Slide =
  | { id: 'program'; data: Record<string, Session>; duration: number }
  | { id: 'open-games'; data: FlatPlayerSearchWithGame[]; duration: number }
  | { id: 'top-games'; data: Game[]; duration: number }
  | { id: 'static'; key: string; title: string; duration: number };

const DEFAULT_DURATION = 20 * 1000;

const STATIC_SLIDES: Array<{ key: string; title: string; duration?: number }> =
  [
    {
      key: 'welcome',
      title: 'Willkommen bei Spielviel',
    },
  ];

export default function ScreenRotator({
  slidesData,
  requestRefresh,
}: {
  slidesData: SlidesData;
  requestRefresh: () => Promise<SlidesData>;
}) {
  const { showNotification } = useNotification();

  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const startTimeRef = useRef(Date.now());
  const shownRef = useRef(false);
  const refreshInFlightRef = useRef(false);
  const slideLockRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;

    shownRef.current = true;

    showNotification({
      message: 'F11 - Vollbildmodus aktivieren für beste Darstellung.',
      type: 'status',
      duration: 3000,
    });
  }, [showNotification]);

  const slides = useMemo(() => {
    const dynamicSlides: Slide[] = [
      { id: 'program', data: slidesData.program, duration: DEFAULT_DURATION },
      {
        id: 'open-games',
        data: slidesData.openGames,
        duration: DEFAULT_DURATION,
      },
      {
        id: 'top-games',
        data: slidesData.topGames,
        duration: DEFAULT_DURATION,
      },
    ];

    const visibleDynamicSlides = dynamicSlides.filter((slide) => {
      switch (slide.id) {
        case 'open-games':
        case 'top-games':
          return slide.data.length > 0;
        case 'program':
          return Object.keys(slide.data).length > 0;
        default:
          return true;
      }
    });

    const staticSlides: Slide[] = STATIC_SLIDES.map((slide) => ({
      id: 'static',
      key: slide.key,
      title: slide.title,
      duration: slide.duration ?? DEFAULT_DURATION,
    }));

    return [...staticSlides, ...visibleDynamicSlides];
  }, [slidesData]);

  const currentSlide = slides[index];

  const refreshAtRoundEnd = useCallback(async () => {
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;

    try {
      await requestRefresh();
    } catch (err) {
      console.error('refresh failed', err);
      showNotification({
        message: 'Fehler beim Aktualisieren der Slides.',
        type: 'error',
        duration: 3000,
      });
    } finally {
      refreshInFlightRef.current = false;
    }
  }, [requestRefresh, showNotification]);

  const goNext = useCallback(() => {
    if (slideLockRef.current || slides.length === 0) return;

    slideLockRef.current = true;

    setIndex((prev) => {
      const next = prev + 1;

      if (next >= slides.length) {
        void refreshAtRoundEnd();
        return 0;
      }

      return next;
    });

    setTimeout(() => {
      slideLockRef.current = false;
    }, 50);
  }, [slides.length, refreshAtRoundEnd]);

  useEffect(() => {
    if (slides.length === 0) {
      setIndex(0);
      return;
    }

    setIndex((prev) => Math.min(prev, slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (slideLockRef.current || slides.length === 0) return;

      if (e.key === 'ArrowRight') {
        goNext();
      }

      if (e.key === 'ArrowLeft') {
        slideLockRef.current = true;

        setIndex((prev) => {
          const next = (prev - 1 + slides.length) % slides.length;
          return next;
        });

        setTimeout(() => {
          slideLockRef.current = false;
        }, 50);
      }
    }

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [slides.length, goNext]);

  if (slides.length === 0 || !currentSlide) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background text-2xl font-semibold text-primary">
        Keine Daten verfügbar.
      </div>
    );
  }

  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={
            currentSlide.id === 'static'
              ? `static-${currentSlide.key}`
              : currentSlide.id
          }
          className="absolute inset-0"
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

          {currentSlide.id === 'static' && (
            <StaticInfoSlide title={currentSlide.title} />
          )}
          {/* TODO: remove progress bar? */}
          <motion.div
            key={`progress-${index}`}
            className="progress-bar fixed bottom-0 left-0 h-1 w-full origin-left bg-primary"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{
              duration: currentSlide.duration / 1000,
              ease: 'linear',
            }}
            onAnimationComplete={goNext}
          />
        </motion.div>
      </AnimatePresence>

      {isDev && (
        <div className="fixed right-3 top-3 rounded bg-black/70 p-2 font-mono text-xs text-white">
          <div>slide: {currentSlide.id}</div>
          <div>index: {index}</div>
          <div>slides.length: {slides.length}</div>
          <div>elapsed: {elapsed}</div>
          <div>target: {currentSlide.duration}</div>
          <div>drift: {elapsed - currentSlide.duration}</div>
          <div>refreshing: {refreshInFlightRef.current ? 'yes' : 'no'}</div>
          <div>
            keys: program={Object.keys(slidesData.program).length}, openGames=
            {slidesData.openGames.length}, topGames={slidesData.topGames.length}
          </div>
        </div>
      )}
    </div>
  );
}
