'use client';

import { useEffect, useState } from 'react';
import Loading from '@components/Loading';
import RatingHexagon from '@components/RatingHexagon';
import { useNotification } from '@context/NotificationContext';
import { Game } from '../page';
import { AppError } from '../types/ApiError';
import Image from 'next/image';
import GameUpdateButton from './GameUpdateButton';

interface GameDetailsProps {
  gameId: string;
}

const GameDetails = ({ gameId }: GameDetailsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);
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

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const handleSuccess = (updatedGameData?: Game) => {
    if (updatedGameData) {
      setGame(updatedGameData);
    }
  };

  if (loading) return <Loading />;
  if (!game || error) return <div>Spiel nicht gefunden.</div>;

  return (
    <div className="mt-9 flex flex-col items-center justify-center md:ml-9 md:flex-row md:items-start">
      <div className="relative w-80 flex-shrink-0 overflow-hidden truncate rounded-l-md md:w-[700px]">
        <Image
          className={`${!game?.available && 'opacity-60'}`}
          src={game?.img_url || '/noImage.jpg'}
          alt={game?.name}
          width={900}
          height={900}
        />
        {!game.available && (
          <div
            className="absolute -left-14 top-[105px] origin-top-left -rotate-45 transform bg-red-500 px-6 py-2 text-center text-sm font-bold text-white"
            style={{
              width: '230px',
              height: '40px',
            }}
          >
            Verliehen
          </div>
        )}
      </div>
      <div className="mt-9 flex flex-col px-12 md:mt-20 md:items-start md:justify-start">
        <div className="flex items-center justify-center">
          <RatingHexagon rating={game.rating} />
          <div>
            <h1 className="text-xl font-bold md:text-4xl">{game.name}</h1>
            <p>{game.year_published}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <GameUpdateButton
            game={game}
            operation="borrow"
            buttonType="detail"
            text="ausgeliehen"
            onSuccess={handleSuccess}
          />
          <GameUpdateButton
            game={game}
            operation="return"
            buttonType="detail"
            text="zurück gebracht"
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
