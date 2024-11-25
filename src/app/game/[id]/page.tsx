'use client';

import GameUpdateButton from '@components/GameUpdateButton';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Game } from '../../page';
import Loading from '@components/Loading';

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
    <div className="mt-9 flex w-full flex-col items-center justify-center">
      <Image
        className={`${!isAvailable && 'opacity-40'}`}
        src={game.img_url || 'fallbackImage'}
        alt={game.name}
        width={330}
        height={330}
      />
      <div className="mt-9 flex w-full flex-col items-center justify-center px-16">
        <h1 className="text-xl">{game.name}</h1>
        <p>{game.year_published}</p>
        <table className="mt-9 table w-full">
          <tbody className="w-full">
            <tr className="flex w-full justify-between">
              <td>Spielerzahl:</td>
              <td>
                {game.max_players === game.min_players
                  ? `${game?.max_players} Spieler`
                  : `${game?.min_players} - ${game?.max_players} Spieler`}
              </td>
            </tr>
            {game.max_playtime && (
              <tr className="flex w-full justify-between">
                <td className="text-right">Spielzeit:</td>
                <td>
                  {game.max_playtime === game.min_playtime
                    ? `ca. ${game.playing_time} Minuten`
                    : `ca. ${game.min_playtime} - ${game.max_playtime} Minuten`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex">
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
  );
};

export default GamePage;
