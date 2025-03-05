'use client';

import { useEffect, useState } from 'react';
import Loading from '@components/Loading';
import RatingHexagon from '@components/RatingHexagon';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';
import GameDescription from './GameDescription';
import GameSimilarGames from './GameSimilarGames';
import FloatingUpdateButtons from './FloatingUpdateButtons';
import { Game, PlayerSearch } from '@context/GamesContext';
import DetailedGameImage from './DetailedGameImage';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@icons/ArrowLeftIcon';
import BGGIcon from '@icons/BGGIcon';
import ComplexityPill from './ComplexityPill';
import { useSession } from 'next-auth/react';
import { useModal } from '@context/ModalContext';
import ExplainersList from './ExplainersList';
import LightbulbIcon from '@icons/LightbulbIcon';
import PlayerSearchTable from './PlayerSearchTable';

interface GameDetailsProps {
  gameId: string;
}

const GameDetails = ({ gameId }: GameDetailsProps) => {
  const { showNotification } = useNotification();
  const router = useRouter();
  const { data: session } = useSession();
  const { openModal } = useModal();
  const [loading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [playerSearches, setPlayerSearches] = useState<PlayerSearch[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGameDetails = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/games/game/${gameId}?${queryParams.toString()}`,
      );

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const data: Game = await response.json();
      setGame(data);
      setPlayerSearches(data.player_searches);

      if (data.similar_games && data.similar_games.length > 0) {
        const relatedIds = data.similar_games;
        await fetchRelatedGames(relatedIds);
      }
    } catch (err) {
      const error = err as AppError;
      setError(error.detail.message);
      showNotification({
        message: `Fehler: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedGames = async (relatedIds: number[]) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/by-ids`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(relatedIds),
        },
      );

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const relatedGamesData: Game[] = await response.json();
      setRelatedGames([...relatedGamesData]);
      //setRelatedGames([...relatedGamesData].sort(() => Math.random() - 0.5));
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: `Fehler beim Laden verwandter Spiele: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    }
  };

  const handlePlayerSearchUpdate = (updatedPlayerSearch: PlayerSearch) => {
    setPlayerSearches((prevPlayerSearches) =>
      prevPlayerSearches.map((ps) =>
        ps.id === updatedPlayerSearch.id ? updatedPlayerSearch : ps,
      ),
    );
  };

  const handlePlayerSearchDelete = (deletedPlayerSearch: PlayerSearch) => {
    setPlayerSearches((prevPlayerSearches) => {
      const updatedSearches = prevPlayerSearches.filter(
        (ps) => ps.id !== deletedPlayerSearch.id,
      );

      const storedTokens = JSON.parse(
        localStorage.getItem('edit_tokens') || '[]',
      );

      if (deletedPlayerSearch.edit_token) {
        const updatedTokens = storedTokens.filter(
          (token: string | null) =>
            token && token !== deletedPlayerSearch.edit_token,
        );

        localStorage.setItem('edit_tokens', JSON.stringify(updatedTokens));
      }

      return updatedSearches;
    });
  };

  const handlePlayerSearchCreate = (newPlayerSearch: PlayerSearch) => {
    setPlayerSearches((prevPlayerSearches) => [
      ...prevPlayerSearches,
      { ...newPlayerSearch, can_edit: true },
    ]);
  };

  const handleGameUpdate = (updatedGame: Game) => {
    setGame(updatedGame);
  };

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  if (loading) return <Loading />;
  if (!game || error) return <div>Spiel nicht gefunden.</div>;

  return (
    <>
      <div className="flex w-full justify-between px-2 pt-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full text-primary"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <ArrowLeftIcon tailwindColor="text-primary" className="h-7 w-7" />
          </div>
        </button>
        <div className="flex items-center gap-2">
          {session && session.user?.role !== 'user' && (
            <button
              onClick={() =>
                openModal((loadingFromContext) => (
                  <>
                    <ExplainersList game={game} />
                    {loadingFromContext && <Loading />}
                  </>
                ))
              }
              className="flex items-center gap-2 rounded-full text-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <LightbulbIcon
                  tailwindColor="text-primary"
                  className="h-7 w-7"
                />
              </div>
            </button>
          )}
          <a
            href={`https://boardgamegeek.com/boardgame/${game.bgg_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <BGGIcon tailwindColor="text-primary" className="h-6 w-6" />
            </div>
          </a>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="mt-4 flex flex-col items-center justify-center md:ml-9 md:flex-row md:items-start 2xl:mt-10">
          <DetailedGameImage game={game} />
          <div className="mt-9 flex flex-col justify-start px-12 md:mt-20">
            <div className="flex justify-center md:justify-start">
              <RatingHexagon rating={game.rating} bggId={game.bgg_id} />
              <div>
                <h1 className="text-wrap text-xl font-bold md:text-4xl">
                  {game.name}{' '}
                </h1>
                <div className="mb-2 flex flex-col justify-between md:mt-2 md:text-lg">
                  <div>
                    {game.min_players && game.max_players && (
                      <p className="text-md mb-2">
                        {game.min_players === game.max_players
                          ? `${game?.max_players} Spieler`
                          : `${game?.min_players} - ${game?.max_players} Spieler`}{' '}
                        | {game.player_age}+ <br />
                        {game.min_playtime === game.max_playtime
                          ? `${game?.max_playtime} Min`
                          : `${game?.min_playtime} - ${game?.max_playtime} Min`}
                      </p>
                    )}
                    <ComplexityPill
                      complexityName={game.complexity_label}
                      className="py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <GameDescription game={game} />
          </div>
        </div>
        <h3 className="m-4 self-start text-lg font-semibold md:m-8 md:mb-4">
          Mitspieler Gesucht:
        </h3>
        <PlayerSearchTable
          playerSearches={playerSearches}
          game={game}
          tableDescription="Hier findest du Leute die bereits nach Mitspielern suchen:"
          onUpdateSuccess={handlePlayerSearchUpdate}
          onCreateSuccess={handlePlayerSearchCreate}
          onDeleteSuccess={handlePlayerSearchDelete}
        />
        <GameSimilarGames relatedGames={relatedGames} />
      </div>
      <FloatingUpdateButtons game={game} handleSuccess={handleGameUpdate} />
    </>
  );
};

export default GameDetails;
