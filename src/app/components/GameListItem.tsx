import Image from 'next/legacy/image';
import { Game } from '../page';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import GameUpdateButton from './GameUpdateButton';

type GameListItemProps = {
  game: Game;
  updateGameAvailability: (gameId: number, isAvailable: boolean) => void;
};

const GameListItem: React.FC<GameListItemProps> = ({
  game,
  updateGameAvailability,
}: GameListItemProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(game.is_available);

  useEffect(() => {
    if (!game) return;
    setIsAvailable(game.is_available);
  }, [game]);

  return (
    <li className="m-2">
      <div className="flex h-24 items-center justify-between rounded-md bg-white shadow-md">
        <Link
          className={`${!isAvailable && 'opacity-40'} flex w-full items-center`}
          href={{
            pathname: `/game/${game.id}`,
            query: { bgg_id: game.bgg_id, is_available: isAvailable },
          }}
        >
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden truncate rounded-l-md">
            {game.img_url && (
              <Image
                src={game.img_url}
                alt={game.name}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                priority
              />
            )}
          </div>

          <div className="ml-4 mt-2">
            <h2 className="text-md">{game.name}</h2>
          </div>
        </Link>

        <div className="flex">
          <GameUpdateButton
            gameId={game.id}
            setAvailable={false}
            buttonType="list"
            updateFunction={(value) => {
              setIsAvailable(value);
              updateGameAvailability(game.id, value);
            }}
          />
          <GameUpdateButton
            gameId={game.id}
            setAvailable={true}
            buttonType="list"
            updateFunction={(value) => {
              setIsAvailable(value);
              updateGameAvailability(game.id, value);
            }}
          />
        </div>
      </div>
    </li>
  );
};

export default GameListItem;
