'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import SearchBar from '@components/SearchBar';
import GameListItem from '@components/GameListItem';
import Loading from '@components/Loading';
import { useNotification } from '@context/NotificationContext';
import ScrollToTopButton from '@components/ScrollTopButton';
import { Game, GAMES_LIST_LIMIT, useGames } from '@context/GamesContext';
import { FilterState, useFilter } from '@context/FilterContext';
import { AppError } from './types/ApiError';
import { ComplexityMapping } from '@lib/utils';

const Games: React.FC = () => {
  const {
    games,
    setGames,
    offset,
    setOffset,
    hasMore,
    setHasMore,
    setTotalCount,
    loading,
    setLoading,
  } = useGames();
  const { filter } = useFilter();
  const [oldFilter, setOldFilter] = useState<FilterState>(filter);
  const [pendingFilterChange, setPendingFilterChange] = useState(false);
  const { showNotification } = useNotification();
  const observer = useRef<IntersectionObserver | null>(null);
  const [noGames, setNoGames] = useState<boolean>(false);

  const fetchGames = async (newOffset: number, reset: boolean = false) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (reset) {
        setNoGames(false);
        setHasMore(true);
        setGames([]);
        setTotalCount(0);
      }

      const queryParams = new URLSearchParams({
        limit: String(GAMES_LIST_LIMIT),
        offset: String(newOffset),
        filter_text: filter.filterText,
        show_available_only: String(filter.showAvailableOnly),
        show_missing_ean_only: String(filter.showMissingEanOnly),
        min_player_count: String(filter.minPlayerCount),
        player_age: String(filter.minAge),
      });

      if (
        filter.complexity.length > 0 &&
        filter.complexity.length < Object.keys(ComplexityMapping).length
      ) {
        filter.complexity.forEach((complexity) => {
          queryParams.append('complexities', complexity);
        });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games?${queryParams.toString()}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          setNoGames(true);
          showNotification({
            message: 'Keine Spiele gefunden. Bitte passe deine Filter an.',
            type: 'status',
            duration: 3000,
          });
          setGames([]);
          setTotalCount(0);
          return;
        }
        throw new Error(errorData.detail.message);
      }

      const data = await response.json();

      setGames((prevGames) => {
        if (reset) {
          return data.games;
        }

        const newGames = data.games.filter(
          (game: Game) => !prevGames.some((g) => g.id === game.id),
        );
        return [...prevGames, ...newGames];
      });
      setTotalCount(data.total);

      if (data.games.length < GAMES_LIST_LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      const error = err as AppError;
      console.error('[ERROR] Fetch failed:', error);
      showNotification({
        message: `Fehler: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const lastGameRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setOffset((prevOffset) => prevOffset + GAMES_LIST_LIMIT);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setOffset],
  );

  useEffect(() => {
    const hasFilterChanged =
      JSON.stringify(oldFilter) !== JSON.stringify(filter);

    if (hasFilterChanged) {
      // Filter has changed
      setOldFilter(filter);
      setPendingFilterChange(true);
      if (offset !== 0) {
        setOffset(0);
        return;
      }
      // reload if offset was 0
      fetchGames(0, true);
      setPendingFilterChange(false);
    } else {
      // Filter has not changed.
      if (pendingFilterChange && offset === 0) {
        fetchGames(0, true);
        setPendingFilterChange(false);
      } else if (offset > 0) {
        fetchGames(offset, false);
      } else if (offset === 0 && games.length === 0 && !loading) {
        // Initial-Fetch
        fetchGames(0, true);
      }
    }
  }, [filter, offset]);

  return (
    <div className="mb-16 flex flex-col items-center">
      <SearchBar />
      <div className="container mx-auto mt-20 flex flex-col gap-8 px-2 lg:flex-row lg:px-8">
        <div className="flex-grow">
          {noGames && !loading && (
            <div className="px-4 pt-8 text-center text-gray-500">
              <p>
                Es wurden keine Spiele gefunden. Bitte passe deine Filter an.
              </p>
            </div>
          )}
          {!noGames && (
            <ul className="md:gap4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {games.map((game, index) => {
                if (index === games.length - 1) {
                  return (
                    <GameListItem ref={lastGameRef} key={game.id} game={game} />
                  );
                }
                return <GameListItem key={game.id} game={game} />;
              })}
            </ul>
          )}
          {loading && <Loading />}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Games;
