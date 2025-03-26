'use client';

import PlayerSearchTable from '@components/PlayerSearchTable';
import {
  PlayerSearchByGame,
  PlayerSearch as PlayerSearchType,
} from '@context/GamesContext';
import { useEffect, useState } from 'react';
import { AppError } from '../types/ApiError';
import { useNotification } from '@context/NotificationContext';
import FancyLoading from '@components/FancyLoading';
import Link from 'next/link';
import Image from 'next/image';
import ComplexityPill from '@components/ComplexityPill';
import { categorizePlayerSearches } from '@lib/utils';
import { useSession } from 'next-auth/react';
import { useFeedback } from '@context/FeedbackContext';

const PlayerSearch = () => {
  const { showNotification } = useNotification();
  const { data: session } = useSession();
  const { addInteraction } = useFeedback();
  const [loading, setLoading] = useState<boolean>(true);
  const [playerSearches, setPlayerSearches] = useState<PlayerSearchByGame[]>(
    [],
  );

  const handlePlayerSearchUpdate = (updatedPlayerSearch: PlayerSearchType) => {
    setPlayerSearches((prevGroups) =>
      prevGroups.map((group) => {
        if (group.game.id === updatedPlayerSearch.game_id) {
          return {
            ...group,
            player_searches: group.player_searches.map((ps) =>
              ps.id === updatedPlayerSearch.id ? updatedPlayerSearch : ps,
            ),
          };
        }
        return group;
      }),
    );
  };

  const handlePlayerSearchDelete = (deletedPlayerSearch: PlayerSearchType) => {
    setPlayerSearches((prevGroups) =>
      prevGroups.map((group) => {
        if (group.game.id === deletedPlayerSearch.game_id) {
          return {
            ...group,
            player_searches: group.player_searches.filter(
              (ps) => ps.id !== deletedPlayerSearch.id,
            ),
          };
        }
        return group;
      }),
    );
  };
  const fetchGameSearches = async () => {
    setLoading(true);

    const storedTokens = JSON.parse(
      localStorage.getItem('edit_tokens') || '[]',
    );

    const queryParams = new URLSearchParams();
    storedTokens.forEach((token: string) => {
      queryParams.append('edit_tokens', token);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/player_search?${queryParams.toString()}`,
      );

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const data: PlayerSearchByGame[] = await response.json();
      setPlayerSearches(data);
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

  useEffect(() => {
    fetchGameSearches();
  }, []);

  if (loading) return <FancyLoading />;

  return (
    <div className="mx-auto p-6">
      <h2 className="mb-2 text-2xl font-bold md:mx-8">
        Mitspieler*innen Suche
      </h2>
      <p className="mb-4 text-sm font-medium text-gray-500 md:mx-8">
        Hier findest du Leute, die bereits nach Mitspieler*innen suchen
      </p>
      {playerSearches.length === 0 ? (
        <div className="bg-whiteshadow-md mb-12 mt-0 flex flex-col items-center rounded-xl bg-white p-4 shadow-md md:m-8 md:mt-0">
          <h2 className="my-8 px-8 text-center text-xl md:mx-8">
            Leider gibt es aktuell keine offenen Mitspieler*innen Suchen. 🫣
          </h2>
        </div>
      ) : (
        playerSearches.map((search: PlayerSearchByGame) => {
          const { valid } = categorizePlayerSearches(search.player_searches);

          if (valid.length === 0 && !session) return null;

          return (
            <div key={search.game.id}>
              <PlayerSearchTable
                playerSearches={search.player_searches}
                game={search.game}
                tableTitle={
                  <Link
                    href={`/game/${search.game.id}`}
                    onClick={() => addInteraction(1)}
                  >
                    <div className="mb-4 flex">
                      <div className="relative mr-4 h-28 w-36 overflow-hidden truncate md:h-44 md:w-44">
                        <Image
                          src={
                            search.game.img_url
                              ? search.game.img_url
                              : '/noImage.jpg'
                          }
                          alt={search.game.name}
                          priority
                          fill
                          sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="ml-3 flex max-w-[45%] flex-col justify-between md:mx-4 md:h-[9.3rem] md:max-w-[90%]">
                        <h2 className="clamp-custom-1 mb-1 text-xl/6 md:text-lg lg:text-xl">
                          {search.game.name}
                        </h2>
                        <div>
                          <p className="mb-1 text-sm text-gray-500 md:block">
                            {search.game.min_players === search.game.max_players
                              ? `${search.game?.max_players} Spieler*innen`
                              : `${search.game?.min_players} - ${search.game?.max_players} Spieler*innen`}
                            <br />
                            {search.game.min_playtime ===
                            search.game.max_playtime
                              ? `${search.game?.max_playtime} Min`
                              : `${search.game?.min_playtime} - ${search.game?.max_playtime} Min`}{' '}
                            | {search.game.player_age}+
                          </p>
                          <ComplexityPill
                            complexityName="Beginner"
                            className="py-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                }
                allowCreate={false}
                onUpdateSuccess={handlePlayerSearchUpdate}
                onDeleteSuccess={handlePlayerSearchDelete}
              />
            </div>
          );
        })
      )}
    </div>
  );
};
export default PlayerSearch;
