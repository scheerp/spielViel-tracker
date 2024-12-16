'use client';

import React, { useEffect, useState } from 'react';
import FilterCard from '@components/FilterCard';
import GameListItem from '@components/GameListItem';
import Loading from '@components/Loading';
import { useNotification } from '@context/NotificationContext';
import { filterGames } from '@lib/utils';
import ScrollToTopButton from '@components/ScrollTopButton';
import { AppError } from './types/ApiError';

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
  const [minPlayerCount, setMinPlayerCount] = useState<number>(1);
  const { showNotification } = useNotification();

  const fetchGames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`);

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const data = await response.json();

      setGames((prevGames) => {
        const isDifferent = JSON.stringify(prevGames) !== JSON.stringify(data);
        return isDifferent ? data : prevGames;
      });
    } catch (err) {
      const error = err as AppError;
      setError(error.detail.message);
      showNotification({
        message: (
          <div>
            Fehler:
            <br /> {error.detail.message}
          </div>
        ),
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
        minPlayerCount,
      }),
    );
  }, [games, filterText, showAvailableOnly, minPlayerCount]);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mb-16 flex flex-col items-center">
      <FilterCard
        filterText={filterText}
        setFilterText={setFilterText}
        showAvailableOnly={showAvailableOnly}
        setShowAvailableOnly={setShowAvailableOnly}
        minPlayerCount={minPlayerCount}
        setMinPlayerCount={setMinPlayerCount}
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
