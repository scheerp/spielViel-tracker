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
  const [available, setAvailable] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    let isCancelled = false;

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
        if (!isCancelled) {
          setGame(data);
          setAvailable(data?.available);
        }
      } catch (err) {
        const error = err as AppError;
        if (!isCancelled) {
          setError(error.detail.message);
          showNotification({
            message: `Fehler: ${error.detail.message}`,
            type: 'error',
            duration: 3000,
          });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchGameDetails();

    return () => {
      isCancelled = true;
    };
  }, [showNotification]);

  if (loading) return <Loading />;
  if (!game || error) return <div>Spiel nicht gefunden.</div>;

  return (
    <div className="mt-9 flex flex-col items-center justify-center md:ml-9 md:flex-row md:items-start">
      <div className="relative w-80 flex-shrink-0 overflow-hidden truncate rounded-l-md md:w-[700px]">
        <Image
          className={`${!available && 'opacity-60'}`}
          src={game.img_url ? game.img_url : '/noImage.jpg'}
          alt={game.name}
          width={900}
          height={900}
        />

        {!available && (
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
        <div className="mt-9 flex flex-col justify-center gap-4">
          <div className="flex">
            <span className="min-w-28 font-bold">Spielerzahl:</span>
            <span>
              {game.max_players === game.min_players
                ? `${game?.max_players} Spieler`
                : `${game?.min_players} - ${game?.max_players} Spieler`}
            </span>
          </div>
          {game.max_playtime && (
            <div className="flex">
              <span className="min-w-28 font-bold">Spielzeit:</span>
              <span>
                {game.max_playtime === game.min_playtime
                  ? `ca. ${game.playing_time} Minuten`
                  : `ca. ${game.min_playtime} - ${game.max_playtime} Minuten`}
              </span>
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-4">
          <GameUpdateButton
            game={game}
            operation={'borrow'}
            buttonType="detail"
            text="ausgeliehen"
          />
          <GameUpdateButton
            game={game}
            operation={'return'}
            buttonType="detail"
            text="zurück gebracht"
          />
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
