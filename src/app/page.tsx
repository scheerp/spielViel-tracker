'use client';

import React, { useEffect, useState } from 'react';
import FilterCard from '@components/FilterCard';
import GameListItem from '@components/GameListItem';
import Loading from '@components/Loading';
import { useNotification } from '@context/NotificationContext';
import { filterGames } from '@lib/utils';
import ScrollToTopButton from '@components/ScrollTopButton';

export interface Game {
  id: number;
  name: string;
  bgg_id: number;
  available: number;
  borrow_count: number;
  total_copies: number;
  year_published: number;
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  playing_time: number;
  rating: number;
  img_url?: string;
  thumbnail_url?: string;
  ean?: string;
}

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState<number[]>([1, 11]);
  const { showNotification } = useNotification();

  const fetchGames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Spiele');
      }
      const data = await response.json();

      setGames((prevGames) => {
        const isDifferent = JSON.stringify(prevGames) !== JSON.stringify(data);
        return isDifferent ? data : prevGames;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      showNotification({
        message: <div>Fehler: {message}</div>,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();

    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, [showNotification]);

  useEffect(() => {
    setFilteredGames(
      filterGames({
        games,
        filterText,
        showAvailableOnly,
        playerCount,
      }),
    );
  }, [games, filterText, showAvailableOnly, playerCount]);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mb-8 flex flex-col items-center">
      <FilterCard
        filterText={filterText}
        setFilterText={setFilterText}
        showAvailableOnly={showAvailableOnly}
        setShowAvailableOnly={setShowAvailableOnly}
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />
      <div className="container mx-auto flex flex-col gap-8 px-4 lg:flex-row lg:px-8">
        <div className="flex-grow">
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredGames.map((game) => (
              <GameListItem key={game.id} game={game} />
            ))}
          </ul>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Games;
