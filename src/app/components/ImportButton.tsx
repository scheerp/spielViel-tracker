'use client';

import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { useState } from 'react';
import { AppError } from '../types/ApiError';
import { defaultFilterState, useFilter } from '@context/FilterContext';
import { GAMES_LIST_LIMIT, useGames } from '@context/GamesContext';
import { LoadingButton } from './LoadingButton';

const ImportButton = () => {
  const { data: session } = useSession();
  const { setFilter } = useFilter();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const {
    setGames,
    setHasMore,
    setTotalCount,
    loading: gamesLoading,
    setLoading: SetGamesLoading,
  } = useGames();

  const fetchGames = async () => {
    SetGamesLoading(true);

    try {
      const queryParams = new URLSearchParams({
        GAMES_LIST_LIMIT: String(GAMES_LIST_LIMIT),
        offset: String(0),
        filter_text: defaultFilterState.filterText,
        show_available_only: String(defaultFilterState.showAvailableOnly),
        show_missing_ean_only: String(defaultFilterState.showMissingEanOnly),
        min_player_count: String(defaultFilterState.minPlayerCount),
        player_age: String(defaultFilterState.minAge),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games?${queryParams.toString()}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail.message);
      }

      const data = await response.json();

      setGames(data.games);
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
      SetGamesLoading(false);
    }
  };

  const fetchCollection = async (mode: 'quick' | 'full') => {
    if (!session) {
      showNotification({
        message: 'Fehler: Keine Sitzung gefunden.',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${mode === 'quick' ? '/fetch_private_collection_quick' : '/fetch_complete_collection'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Fehler: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.added > 0 || result.deleted > 0 || result.updated > 0) {
        setFilter(defaultFilterState);
        fetchGames();
        showNotification({
          message: (
            <div>
              Sammlung erfolgreich aktualisiert:
              <br /> {result.added} Spiele hinzugefügt!
              <br /> {result.updated} Spiele aktualisiert!
              <br /> {result.deleted} Spiele gelöscht!
            </div>
          ),
          type: 'success',
          duration: 3000,
        });
      } else {
        showNotification({
          message: 'Liste bereits aktuell!',
          type: 'status',
          duration: 3000,
        });
      }
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: `Fehler: ${error.detail.message}`,
        type: 'error',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionFull = () => {
    fetchCollection('full');
  };

  const fetchCollectionQuick = () => {
    fetchCollection('quick');
  };
  return (
    <>
      <div className="flex max-w-72 flex-col items-center overflow-hidden rounded-xl bg-white p-5 shadow-md md:gap-2">
        <p className="mb-2 text-center text-sm text-gray-500">
          Hinweis: Der Vorgeng kann einige Sekunden dauern, und holt nicht alle
          Details der neuen Spiele!
        </p>

        <LoadingButton
          loading={loading || gamesLoading}
          buttonText="Schneller Import"
          onClick={fetchCollectionQuick}
        />
      </div>

      {session?.user?.role === 'admin' && (
        <div className="flex max-w-72 flex-col items-center overflow-hidden rounded-xl bg-white p-5 shadow-md md:gap-2">
          <p className="mb-2 text-center text-sm text-gray-500">
            Hinweis: Der Vorgeng kann einige Minuten dauern!
          </p>

          <LoadingButton
            loading={loading || gamesLoading}
            buttonText="Voller Import"
            onClick={fetchCollectionFull}
          />
        </div>
      )}
    </>
  );
};

export default ImportButton;
