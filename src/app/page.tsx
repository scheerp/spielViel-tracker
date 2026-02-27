'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import SearchBar from '@components/SearchBar';
import GameListItem from '@components/GameListItem';
import { useNotification } from '@context/NotificationContext';
import ScrollToTopButton from '@components/ScrollTopButton';
import { Game, GAMES_LIST_LIMIT, useGames } from '@context/GamesContext';
import { FilterState, useFilter } from '@context/FilterContext';
import { AppError } from './types/ApiError';
import { ComplexityMapping } from '@lib/utils';
import { useSession } from 'next-auth/react';
import FancyLoading from '@components/FancyLoading';
import { supabase } from './api/supabase';

const Games: React.FC = () => {
  const { data: session } = useSession();
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
  const [editFamiliarity, setEditFamiliarity] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<number[]>([]);

const fetchGamesSupabase = async (newOffset: number, reset: boolean = false) => {
  if (loading) return;

  setLoading(true);

  try {
    if (reset) {
      setNoGames(false);
      setHasMore(true);
      setGames([]);
      setTotalCount(0);
    }

    console.log({filter});
    

    const { data, error } = await supabase.rpc('get_games_public', {
      p_limit: GAMES_LIST_LIMIT,
      p_offset: newOffset,
      p_filter_text: filter.filterText || null,
      p_show_available_only: filter.showAvailableOnly,
      p_min_player_count: filter.minPlayerCount || 1,
      p_player_age: filter.minAge || 0,
      p_show_missing_ean_only: filter.showMissingEanOnly,
      p_complexities:
        filter.complexity.length > 0 ? filter.complexity : null,
      p_user_id: session?.user?.id ?? null,
    });

    if (error) throw error;

    if (data.games.length === 0) {
      setNoGames(true);
      setGames([]);
      setTotalCount(0);
      showNotification({
        message: 'Keine Spiele gefunden. Bitte passe deine Filter an.',
        type: 'status',
        duration: 3000,
      });
      return;
    }

    // Daten im gleichen Format wie vorher setzen
    setGames((prevGames) => {
      if (reset) return data.games;

      const newGames = data.games.filter(
        (game: Game) => !prevGames.some((g) => g.id === game.id)
      );
      return [...prevGames, ...newGames];
    });

    setTotalCount(data.total);
    setHasMore(data.games.length >= GAMES_LIST_LIMIT);
  } catch (err: any) {
    console.error(err);
    showNotification({
      message: `Fehler: ${err.message}`,
      type: 'error',
      duration: 3000,
    });
  } finally {
    setLoading(false);
  }
};

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
        user_id: String(session?.user?.id ?? 0),
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

  // Toggle-Fvourite-Funktion für ein Spiel
  const toggleFavourite = useCallback((gameId: number) => {
    setFavourites((prev) => {
      let updated: number[];
      if (prev.includes(gameId)) {
        updated = prev.filter((id) => id !== gameId);
      } else {
        updated = [...prev, gameId];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('favourites', JSON.stringify(updated));
      }

      return updated;
    });
  }, []);

  // Favoriten beim Mount aus localStorage laden
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = JSON.parse(localStorage.getItem('favourites') || '[]').map(
      Number,
    );

    setFavourites(stored);
  }, []);

  useEffect(() => {
    if (session === undefined) return;

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
      fetchGamesSupabase(0, true);
      setPendingFilterChange(false);
    } else {
      // Filter has not changed.
      if (pendingFilterChange && offset === 0) {
        fetchGamesSupabase(0, true);
        setPendingFilterChange(false);
      } else if (offset > 0) {
        fetchGamesSupabase(offset, false);
      } else if (offset === 0 && games.length === 0 && !loading) {
        // Initial-Fetch
        fetchGamesSupabase(0, true);
      }
    }
  }, [filter, offset, session, session?.user?.id]);
  

  return (
    <div className="mb-16 flex flex-col items-center">
      <SearchBar
        editFamiliarity={editFamiliarity}
        setEditFamiliarity={setEditFamiliarity}
      />
      <div className="container mx-auto mt-[5.1rem] flex flex-col gap-8 px-2 lg:flex-row lg:px-8">
        <div className="flex-grow">
          {noGames && !loading && (
            <div className="px-4 py-16 pt-8 text-center text-gray-500">
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
                    <GameListItem
                      ref={lastGameRef}
                      key={game.id}
                      editFamiliarity={editFamiliarity}
                      game={game}
                      isFavourite={favourites.includes(game.id)}
                      toggleFavourite={() => toggleFavourite(game.id)}
                    />
                  );
                }
                return (
                  <GameListItem
                    key={game.id}
                    editFamiliarity={editFamiliarity}
                    game={game}
                    isFavourite={favourites.includes(game.id)}
                    toggleFavourite={() => toggleFavourite(game.id)}
                  />
                );
              })}
            </ul>
          )}
          {loading && <FancyLoading />}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Games;
