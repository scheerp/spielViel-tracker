'use client';

import Loading from '@components/Loading';
import { Game } from '@context/GamesContext';
import { useNotification } from '@context/NotificationContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Stats = () => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!session) {
      showNotification({
        message: 'Fehler: Keine Sitzung gefunden.',
        type: 'error',
        duration: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/borrowed-games`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      );

      if (!response.ok) throw new Error('Fehler beim Laden der Statistik.');
      const data = await response.json();
      setGames(data.games);
    } catch (err) {
      console.error('Fehler:', err);
      setError('Fehler beim Laden der Statistik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (error || !games) return <div>Statistik nicht gefunden.</div>;

  return (
    <div className="mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">Statistik</h2>
      <div className="mb-8 rounded-xl border border-gray-300 bg-white p-4 shadow-md">
        <h3 className="mb-1 text-lg font-semibold">Spiel Viel 2025</h3>
        <p className="mb-4 text-sm text-gray-500">
          Spiele die noch nicht geliehen wurden tauchen nicht in der Tabelle
          auf.
        </p>
        <table className="w-full table-fixed border-collapse bg-white shadow-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">geliehen</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr
                key={game.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">
                  <Link href={`/game/${game.id}`}>{game.name}</Link>
                </td>
                <td className="p-3 pl-6">{game.borrow_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stats;
