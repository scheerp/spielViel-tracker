'use client';

import FilterCard from '@components/FilterCard';
import GameListItem from '@components/GameListItem';
import Loading from '@components/Loading';
import { useNotification } from '@context/NotificationContext';
import { filterGames, sortGames } from '@lib/utils';
import React, { useEffect, useState } from 'react';

export interface Game {
  id: number;
  name: string;
  img_url: string;
  bgg_id: number;
  is_available: boolean;
}

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Array<Game>>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games`,
        );
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Spiele');
        }
        const data = await response.json();
        setGames(data);
        setFilteredGames(data);
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        setError(message);
        showNotification({
          message: <div>Login fehlgeschlagen: {message}</div>,
          type: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (!games) return;

    const filtered = filterGames(games, filterText, showAvailableOnly);
    const sorted = sortGames(filtered, sortOption);

    setFilteredGames(sorted);
  }, [filterText, sortOption, showAvailableOnly, games]);

  const updateGameAvailability = (gameId: number, isAvailable: boolean) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId ? { ...game, is_available: isAvailable } : game,
      ),
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <FilterCard
        filterText={filterText}
        setFilterText={setFilterText}
        sortOption={sortOption}
        setSortOption={setSortOption}
        showAvailableOnly={showAvailableOnly}
        setShowAvailableOnly={setShowAvailableOnly}
      />
      <ul>
        {filteredGames?.map((game) => (
          <GameListItem
            game={game}
            key={game.name}
            updateGameAvailability={updateGameAvailability}
          />
        ))}
      </ul>
    </div>
  );
};

export default Games;
