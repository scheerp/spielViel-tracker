'use client';

import { useEffect, useState } from 'react';
import { Game } from '@context/GamesContext';
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { Session } from '@components/ProgramCard';
import {
  FlatPlayerSearchWithGame,
  usePlayerSearch,
} from '@context/PlayerSearchContext';
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
  const { openGames, reload } = usePlayerSearch();
  const { data: session, status } = useSession();

  const [topGames, setTopGames] = useState<Game[]>([]);
  const [program, setProgram] = useState<Record<string, Session>>({});
  const [loading, setLoading] = useState(true);

  // Lade TopGames + Program
  const loadAll = async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    try {
      const [topGamesRes, programRes]: [TopGamesResponse, ProgramResponse] =
        await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/games/borrowed-games?limit=20&year=2025`,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            },
          ).then((r) => r.json() as Promise<TopGamesResponse>),
          fetch(
            'https://spielviel.net/programm/api_availability.php',
          ).then((r) => r.json() as Promise<ProgramResponse>),
        ]);

      setTopGames(topGamesRes.games);
      setProgram(programRes.data);

      // PlayerSearches direkt aus Context
      await reload();
    } catch (err) {
      console.error(err);
      showNotification({
        message: 'Fehler beim Laden der Slides.',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (status !== 'authenticated') return;
    loadAll();
  }, [status]);

  // Hinweis Notification
  useEffect(() => {
    showNotification({
      message: 'F11 - Vollbildmodus aktivieren für beste Darstellung.',
      type: 'status',
      duration: 30000,
    });
  }, []);

  if (loading) return null;

  return (
    <ScreenRotator
      key={`${topGames.length}-${Object.keys(program).length}-${openGames.length}`}
      slidesData={{
        topGames,
        program,
        openGames, // direkt aus Context
      }}
      onCompleteRound={loadAll}
    />
  );
}
