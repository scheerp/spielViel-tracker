"use client";

import { useSearchParams } from "next/navigation";
import GameUpdateButton from "@components/GameUpdateButton";
import { use, useEffect, useState } from "react";
import { BoardGame, fetchGameData } from "@lib/fetchGame";
import Image from "next/image";

interface GamePageProps {
  params: {
    id: string;
  };
}

const GamePage = ({ params }: GamePageProps) => {
  const { id } = use(params);
  const [game, setGame] = useState<BoardGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const bggId = searchParams.get("bgg_id");

  useEffect(() => {
    if (bggId) {
      const fetchData = async () => {
        const gameData = await fetchGameData(bggId as string);
        setGame(gameData);
        setLoading(false);
      };

      fetchData();
    }
  }, [bggId]);

  if (loading) return <div>Loading...</div>;
  if (!game) return <div>Spiel nicht gefunden.</div>;

  console.log({ game });
  return (
    <div className="flex justify-center flex-col items-center w-full">
      <Image
        className="m-9"
        src={game.imageUrl}
        alt={game.name}
        width={330}
        height={330}
      />
      <h1>{game.name}</h1>
      <table className="table w-full">
        <tbody className="w-full">
          <tr className="w-full flex justify-around">
            <td>Spielerzahl:</td>
            <td>{`${game.minPlayers} - ${game.maxPlayers} Spieler`}</td>
          </tr>
          <tr className="w-full flex justify-around">
            <td className="text-right">Alter:</td>
            <td>ab {game.minAge} Jahren</td>
          </tr>
        </tbody>
      </table>
      <GameUpdateButton
        gameId={parseInt(id)}
        wasAvailable={true}
        text="ausgeliehen"
      />
      <GameUpdateButton
        gameId={parseInt(id)}
        wasAvailable={false}
        text="zurück gebracht"
      />
    </div>
  );
};

export default GamePage;
