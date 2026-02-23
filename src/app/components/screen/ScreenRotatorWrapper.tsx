'use client';

import { useEffect, useState } from 'react';
import { Game } from '@context/GamesContext';
import ScreenRotator from './Screenrotator';
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';

type SlidesData = {
  topGames?: Game[];
};

export default function ScreenRotatorWrapper() {
  const { data: session, status } = useSession();
  const { showNotification } = useNotification();

  const [data, setData] = useState<SlidesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // erst laden, wenn Session bereit ist
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      showNotification({
        message: 'Fehler: Keine Sitzung gefunden.',
        type: 'error',
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    const loadAll = async () => {
      try {
        const [topGames] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/games/borrowed-games?limit=20&year=2025`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.accessToken}`,
              },
            },
          ).then((r) => r.json()),
        ]);
        setData({ topGames });
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

    loadAll();
  }, [status, session]);

  if (loading || !data) return <div>Lade Slides...</div>;

  return <ScreenRotator slidesData={data} />;
}
