'use client';

import { useSearchParams } from 'next/navigation';
import GameUpdateButton from '@components/GameUpdateButton';
import { use, useEffect, useState } from 'react';
import { BoardGame, fetchGameData } from '@lib/fetchGame';
import Image from 'next/image';
import { Game } from '../../page';
import Loading from '@components/Loading';

interface GamePageProps {
  params: {
    id: string;
  };
}

const GamePage = ({ params }: GamePageProps) => {
  // @ts-expect-error fix this in a later react version
  const { id } = use(params);
  const [bggGame, setBggGame] = useState<BoardGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const bggId = searchParams.get('bgg_id');

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
      }
    };

    fetchGameDetails();

    if (bggId) {
      const fetchData = async () => {
        const gameData = await fetchGameData(bggId as string);
        setBggGame(gameData);
        setLoading(false);
      };

      fetchData();
    }
  }, [bggId, id]);

  if (loading) return <Loading />;
  if (!bggGame || !game || error) return <div>Spiel nicht gefunden.</div>;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Image
        className={`m-9 ${!isAvailable && 'opacity-40'}`}
        src={bggGame.imageUrl}
        alt={bggGame.name}
        width={330}
        height={330}
      />
      <h1 className="text-xl">{bggGame.name}</h1>
      <table className="table w-full">
        <tbody className="w-full">
          <tr className="flex w-full justify-around">
            <td>Spielerzahl:</td>
            <td>{`${bggGame.minPlayers} - ${bggGame.maxPlayers} Spieler`}</td>
          </tr>
          <tr className="flex w-full justify-around">
            <td className="text-right">Alter:</td>
            <td>ab {bggGame.minAge} Jahren</td>
          </tr>
        </tbody>
      </table>
      <div className="flex">
        <GameUpdateButton
          gameId={parseInt(id)}
          setAvailable={false}
          text="ausgeliehen"
          updateFunction={setIsAvailable}
        />
        <GameUpdateButton
          gameId={parseInt(id)}
          setAvailable={true}
          text="zurück gebracht"
          updateFunction={setIsAvailable}
        />
      </div>
    </div>
  );
};

export default GamePage;
