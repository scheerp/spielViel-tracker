'use client';

import GameUpdateButton from '@components/GameUpdateButton';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Game } from '../../page';
import Loading from '@components/Loading';
import RatingHexagon from '@components/RatingHexagon';

interface GamePageProps {
  params: {
    id: string;
  };
}

const GamePage = ({ params }: GamePageProps) => {
  // @ts-expect-error --> fix this in a later react version
  const { id } = use(params);
  const [loading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/game/${id}`,
        );

        if (!response.ok) {
          throw new Error('Spiel nicht gefunden');
        }

        const data: Game = await response.json();
        setGame(data);
        setIsAvailable(data?.is_available);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, []);

  if (loading) return <Loading />;
  if (!game || error) return <div>Spiel nicht gefunden.</div>;

  return (
    <div className="mt-9 flex flex-col items-center justify-center md:ml-9 md:flex-row md:items-start">
      <div className="relative h-80 w-80 flex-shrink-0 overflow-hidden truncate rounded-l-md md:h-[700px] md:w-[700px]">
        <Image
          className={`${!isAvailable && 'opacity-60'}`}
          src={game.img_url ? game.img_url : '/noImage.jpg'}
          alt={game.name}
          width={900}
          height={900}
        />

        {!isAvailable && (
          <div
            className="absolute -left-14 top-[105px] origin-top-left -rotate-45 transform bg-red-600 px-6 py-2 text-center text-sm font-bold text-white"
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
            gameId={parseInt(id)}
            setAvailable={false}
            buttonType="detail"
            text="ausgeliehen"
            updateFunction={setIsAvailable}
          />
          <GameUpdateButton
            gameId={parseInt(id)}
            setAvailable={true}
            buttonType="detail"
            text="zurück gebracht"
            updateFunction={setIsAvailable}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
