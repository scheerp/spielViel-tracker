'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Game } from '@context/GamesContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@context/NotificationContext';
import { Session } from '@components/ProgramCard';
import {
  FlatPlayerSearchWithGame,
  flattenAndCategorizePlayerSearches,
  PlayerSearchByGame,
} from '@context/PlayerSearchContext';
import { EVENT_START, getCurrentEventReference } from '@lib/utils';
import ScreenRotator from './Screenrotator';

type TopGamesResponse = {
  games: Game[];
  total: number;
};

type ProgramResponse = {
  ok: boolean;
  generated_at: string;
  count: number;
  data: Record<string, Session>;
};

export type SlidesData = {
  topGames: Game[];
  program: Record<string, Session>;
  openGames: FlatPlayerSearchWithGame[];
};

export default function ScreenRotatorWrapper() {
  const { showNotification } = useNotification();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const router = useRouter();

  const [slidesData, setSlidesData] = useState<SlidesData | null>(null);

  const inFlightRef = useRef<Promise<SlidesData> | null>(null);

  const loadSlidesData = useCallback(async (): Promise<SlidesData> => {
    if (!session?.accessToken) throw new Error('No access token');

    if (inFlightRef.current) {
      return inFlightRef.current;
    }

    const request = (async () => {
      const now = new Date();
      const { simulatedDate } = getCurrentEventReference({
        now,
        allowDevOverrides: isAdmin,
      });
      const effectiveDate = simulatedDate ?? now;

      const [topGamesResult, programResult, openGamesResult] =
        await Promise.allSettled([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/games/borrowed-games?limit=5&year=${
              effectiveDate >= EVENT_START
                ? effectiveDate.getFullYear()
                : effectiveDate.getFullYear() - 1
            }`,
            { headers: { Authorization: `Bearer ${session.accessToken}` } },
          ).then((r) => r.json() as Promise<TopGamesResponse>),

          fetch('https://spielviel.net/programm/api_availability.php').then(
            (r) => r.json() as Promise<ProgramResponse>,
          ),

          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/player_search/?expire_after_minutes=30`,
          ).then((r) => r.json() as Promise<PlayerSearchByGame[]>),
        ]);

      if (topGamesResult.status === 'rejected') {
        console.error('Top games endpoint failed', topGamesResult.reason);
      }

      if (programResult.status === 'rejected') {
        console.error('Program endpoint failed', programResult.reason);
      }

      if (openGamesResult.status === 'rejected') {
        console.error('Open games endpoint failed', openGamesResult.reason);
      }

      const topGames =
        topGamesResult.status === 'fulfilled' ? topGamesResult.value.games : [];

      const program =
        programResult.status === 'fulfilled' ? programResult.value.data : {};

      const openGames =
        openGamesResult.status === 'fulfilled'
          ? flattenAndCategorizePlayerSearches(openGamesResult.value).valid
          : [];

      const newData: SlidesData = {
        topGames,
        program,
        openGames,
      };

      setSlidesData(newData);
      return newData;
    })();

    inFlightRef.current = request;

    try {
      return await request;
    } catch (err) {
      console.error('Error loading slides', err);
      throw err;
    } finally {
      inFlightRef.current = null;
    }
  }, [isAdmin, session?.accessToken]);

  // Initial Load
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    if (status !== 'authenticated') return;

    const init = async () => {
      try {
        await loadSlidesData();
      } catch {
        showNotification({
          message: 'Fehler beim Laden der Slides.',
          type: 'error',
          duration: 3000,
        });
      }
    };

    init();
  }, [status, loadSlidesData, router, showNotification]);

  if (!slidesData) return null;

  return (
    <ScreenRotator
      slidesData={slidesData}
      // requestRefresh wird nur einmal pro Round aufgerufen
      requestRefresh={loadSlidesData}
    />
  );
}
