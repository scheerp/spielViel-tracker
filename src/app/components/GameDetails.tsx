'use client';

import { useEffect, useState } from 'react';
import Loading from '@components/Loading';
import RatingHexagon from '@components/RatingHexagon';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';
import GameDescription from './GameDescription';
import GameSimilarGames from './GameSimilarGames';
import FloatingUpdateButtons from './FloatingUpdateButtons';
import { Game } from '@context/GamesContext';
import DetailedGameImage from './DetailedGameImage';

interface GameDetailsProps {
  gameId: string;
}

const GameDetails = ({ gameId }: GameDetailsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchGameDetails = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/game/${gameId}`,
      );

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const data: Game = await response.json();
      setGame(data);

      if (data.similar_games) {
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
      setRelatedGames(relatedGamesData);
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: `Fehler beim Laden verwandter Spiele: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    }
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
      <div className="container mx-auto">
        <div className="mt-9 flex flex-col items-center justify-center md:ml-9 md:flex-row md:items-start">
          <DetailedGameImage game={game} />
          <div className="mt-9 flex flex-col px-12 md:mt-20 md:items-start md:justify-start">
            <div className="flex items-center justify-center">
              <RatingHexagon rating={game.rating} />
              <div>
                <h1 className="text-xl font-bold md:text-4xl">{game.name}</h1>
                <p>{game.year_published}</p>
              </div>
            </div>
            <GameDescription game={game} />
          </div>
        </div>
        <GameSimilarGames relatedGames={relatedGames} />
      </div>
      <FloatingUpdateButtons game={game} handleSuccess={handleGameUpdate} />
    </>
  );
};

export default GameDetails;
