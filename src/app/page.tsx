'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import FilterCard from '@components/FilterCard';
import GameListItem from '@components/GameListItem';
import Loading from '@components/Loading';
import { useNotification } from '@context/NotificationContext';
import ScrollToTopButton from '@components/ScrollTopButton';
import { Game, useGames } from '@context/GamesContext';
import { AppError } from './types/ApiError';

const LIMIT = 20;

const Games: React.FC = () => {
  const {
    games,
    setGames,
    offset,
    setOffset,
    hasMore,
    setHasMore,
    loading,
    setLoading,
  } = useGames();
  const { showNotification } = useNotification();
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchGames = async (newOffset: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games?limit=${LIMIT}&offset=${newOffset}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail.message);
      }

      const data = await response.json();

      setGames((prevGames) => {
        const newGames = data.filter(
          (game: Game) => !prevGames.some((g) => g.id === game.id),
        );
        return [...prevGames, ...newGames];
      });

      if (data.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      const error = err as AppError;
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

  // Infinite Scrolling
  const lastGameRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + LIMIT);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    if (offset === 0 && games.length === 0) {
      fetchGames(offset);
    } else if (offset > 0) {
      fetchGames(offset);
    }
  }, [offset]);

  return (
    <div className="mb-16 flex flex-col items-center">
      <FilterCard
        filterText=""
        setFilterText={() => {}}
        showAvailableOnly={false}
        setShowAvailableOnly={() => {}}
        minPlayerCount={1}
        setMinPlayerCount={() => {}}
      />
      <div className="container mx-auto flex flex-col gap-8 px-4 lg:flex-row lg:px-8">
        <div className="flex-grow">
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game, index) => {
              if (index === games.length - 1) {
                return (
                  <GameListItem ref={lastGameRef} key={game.id} game={game} />
                );
              }
              return <GameListItem key={game.id} game={game} />;
            })}
          </ul>
          {loading && <Loading />}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Games;
