'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import UpcommingSessionsSlide from './slides/UpcommingSessionsSlide';
import OpenPlayersearchSlide from './slides/OpenPlayersearchSlide';
import TopGamesSlide from './slides/TopGamesSlide';
import StaticInfoSlide from './slides/StaticInfoSlide';
import StartSlide from './slides/StartSlide';
import { SlidesData } from './ScreenRotatorWrapper';
import { Game } from '@context/GamesContext';
import { Session } from '@components/ProgramCard';
import { FlatPlayerSearchWithGame } from '@context/PlayerSearchContext';
import { useNotification } from '@context/NotificationContext';
import { useSession } from 'next-auth/react';
import { getUpcomingSessionsForCurrentDay, isWithinEvent } from '@lib/utils';
import { useDevHudSetting } from '@hooks/useDevHudSettings';

type Slide =
  | { id: 'start'; duration: number }
  | { id: 'program'; data: Record<string, Session>; duration: number }
  | {
      id: 'open-games';
      key: string;
      data: FlatPlayerSearchWithGame[];
      duration: number;
    }
  | { id: 'top-games'; data: Game[]; duration: number }
  | {
      id: 'static';
      key: string;
      title: string;
      imageSrc?: string;
      imageAlt?: string;
      duration: number;
    };

const DEFAULT_DURATION = 20 * 1000;
const OPEN_GAMES_PER_SLIDE = 5;

const chunkOpenGames = (
  openGames: FlatPlayerSearchWithGame[],
): FlatPlayerSearchWithGame[][] => {
  const sortedOpenGames = [...openGames].sort((a, b) => {
    const aTime = new Date(a.player_search.created_at).getTime();
    const bTime = new Date(b.player_search.created_at).getTime();

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
      return b.player_search.id - a.player_search.id;
    }

    return bTime - aTime;
  });

  const chunks: FlatPlayerSearchWithGame[][] = [];

  for (let i = 0; i < sortedOpenGames.length; i += OPEN_GAMES_PER_SLIDE) {
    chunks.push(sortedOpenGames.slice(i, i + OPEN_GAMES_PER_SLIDE));
  }

  return chunks;
};

const STATIC_SLIDES: Array<{
  key: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  duration?: number;
}> = [
  /*   {
    key: 'welcome',
    title: 'Willkommen auf der Spiel Viel',
    imageSrc: 'logo.svg',
    imageAlt: 'Spielviel Logo',
  }, */
];

export default function ScreenRotator({
  slidesData,
  requestRefresh,
}: {
  slidesData: SlidesData;
  requestRefresh: () => Promise<SlidesData>;
}) {
  const { showNotification } = useNotification();
  const { data: session, status } = useSession();
  const [showScreenHud] = useDevHudSetting('screenHud');
  const searchParams = useSearchParams();

  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [lastCycleDuration, setLastCycleDuration] = useState<number | null>(
    null,
  );

  const startTimeRef = useRef(Date.now());
  const indexRef = useRef(0);
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
    const allowDevOverrides =
      status === 'authenticated' && session?.user?.role === 'admin';

    const openGamesChunks = chunkOpenGames(slidesData.openGames);
    const openGamesSlides: Slide[] = openGamesChunks.map((chunk, index) => ({
      id: 'open-games',
      key: `open-games-${index + 1}`,
      data: chunk,
      duration: DEFAULT_DURATION,
    }));

    const dynamicSlides: Slide[] = [
      { id: 'program', data: slidesData.program, duration: DEFAULT_DURATION },
      ...openGamesSlides,
      {
        id: 'top-games',
        data: slidesData.topGames,
        duration: DEFAULT_DURATION,
      },
    ];

    const visibleDynamicSlides = dynamicSlides.filter((slide) => {
      switch (slide.id) {
        case 'open-games':
          return (
            slide.data.length > 0 &&
            isWithinEvent({
              searchParams,
              allowDevOverrides,
            })
          );
        case 'top-games':
          return slide.data.length > 0;
        case 'program':
          return (
            getUpcomingSessionsForCurrentDay(Object.values(slide.data), {
              limit: 4,
              searchParams,
              allowDevOverrides,
            }).length > 0
          );
        default:
          return true;
      }
    });

    const startSlide: Slide = { id: 'start', duration: DEFAULT_DURATION * 20 };

    const staticSlides: Slide[] = STATIC_SLIDES.map((slide) => ({
      id: 'static',
      key: slide.key,
      title: slide.title,
      imageSrc: slide.imageSrc,
      imageAlt: slide.imageAlt,
      duration: slide.duration ?? DEFAULT_DURATION,
    }));

    return [startSlide, ...staticSlides, ...visibleDynamicSlides];
  }, [searchParams, session?.user?.role, slidesData, status]);

  const currentSlide = slides[index];
  const cycleDurationTarget = useMemo(
    () => slides.reduce((sum, slide) => sum + slide.duration, 0),
    [slides],
  );
  const formatDuration = useCallback(
    (ms: number) => `${(ms / 1000).toFixed(1)}s`,
    [],
  );
  const cycleStartRef = useRef(Date.now());

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

    const currentIndex = indexRef.current;
    const isWrapping = currentIndex + 1 >= slides.length;
    const nextIndex = isWrapping ? 0 : currentIndex + 1;

    setIndex(nextIndex);

    if (isWrapping) {
      const now = Date.now();
      setLastCycleDuration(now - cycleStartRef.current);
      cycleStartRef.current = now;
      setRoundsCompleted((rounds) => rounds + 1);
      void refreshAtRoundEnd();
    }

    setTimeout(() => {
      slideLockRef.current = false;
    }, 50);
  }, [slides.length, refreshAtRoundEnd]);

  useEffect(() => {
    if (!currentSlide || slides.length === 0) return;

    const timeout = setTimeout(() => {
      goNext();
    }, currentSlide.duration);

    return () => clearTimeout(timeout);
  }, [currentSlide, goNext, slides.length]);

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
    indexRef.current = index;
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

        const currentIndex = indexRef.current;
        const nextIndex = (currentIndex - 1 + slides.length) % slides.length;
        setIndex(nextIndex);

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

  const isAdmin = status === 'authenticated' && session?.user?.role === 'admin';
  const showDebugHud = isAdmin && showScreenHud;

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={
            currentSlide.id === 'static'
              ? `static-${currentSlide.key}`
              : currentSlide.id === 'open-games'
                ? currentSlide.key
                : currentSlide.id
          }
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {currentSlide.id === 'program' && (
            <UpcommingSessionsSlide data={currentSlide.data} />
          )}

          {currentSlide.id === 'start' && (
            <StartSlide animationNonce={roundsCompleted} />
          )}

          {currentSlide.id === 'open-games' && (
            <OpenPlayersearchSlide data={currentSlide.data} />
          )}

          {currentSlide.id === 'top-games' && (
            <TopGamesSlide data={currentSlide.data} />
          )}

          {currentSlide.id === 'static' && (
            <StaticInfoSlide
              title={currentSlide.title}
              imageSrc={currentSlide.imageSrc}
              imageAlt={currentSlide.imageAlt}
            />
          )}
          {/* TODO: remove progress bar? */}
          <motion.div
            key={`progress-${index}`}
            className="progress-bar fixed bottom-0 left-0 h-1 w-full origin-right bg-primary"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{
              duration: currentSlide.duration / 1000,
              ease: 'linear',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {showDebugHud && (
        <div className="pointer-events-none fixed right-3 top-3 z-[1000] w-[22rem] max-w-[calc(100vw-1.5rem)] rounded bg-black/70 p-3 font-mono text-xs text-white">
          <div className="mb-2 font-bold">DEV-Screen debug</div>

          <div className="mb-2 border-b border-white/20 pb-2">
            <div className="grid grid-cols-[7rem_1fr] gap-y-1">
              <div className="text-white/70">slide</div>
              <div>
                {currentSlide.id === 'open-games'
                  ? currentSlide.key
                  : currentSlide.id}
              </div>
              <div className="text-white/70">index</div>
              <div>{index}</div>
              <div className="text-white/70">slides</div>
              <div>{slides.length}</div>
              <div className="text-white/70">refreshing</div>
              <div>{refreshInFlightRef.current ? 'yes' : 'no'}</div>
            </div>
          </div>

          <div className="mb-2 border-b border-white/20 pb-2">
            <div className="grid grid-cols-[7rem_1fr] gap-y-1">
              <div className="text-white/70">elapsed</div>
              <div>{elapsed}</div>
              <div className="text-white/70">target</div>
              <div>{currentSlide.duration}</div>
              <div className="text-white/70">drift</div>
              <div>{elapsed - currentSlide.duration}</div>
            </div>
          </div>

          <div className="mb-2 border-b border-white/20 pb-2">
            <div className="grid grid-cols-[7rem_1fr] gap-y-1">
              <div className="text-white/70">cycles</div>
              <div>{roundsCompleted}</div>
              <div className="text-white/70">cycleTarget</div>
              <div>{formatDuration(cycleDurationTarget)}</div>
              <div className="text-white/70">lastCycle</div>
              <div>
                {lastCycleDuration !== null
                  ? formatDuration(lastCycleDuration)
                  : '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[7rem_1fr] gap-y-1">
            <div className="text-white/70">program</div>
            <div>{Object.keys(slidesData.program).length}</div>
            <div className="text-white/70">openGames</div>
            <div>{slidesData.openGames.length}</div>
            <div className="text-white/70">topGames</div>
            <div>{slidesData.topGames.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
