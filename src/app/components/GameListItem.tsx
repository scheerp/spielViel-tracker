import Image from 'next/legacy/image';
import { Game } from '../page';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import GameUpdateButtonList from './GameUpdateButtonList';

type GameListItemProps = { game: Game };

const GameListItem: React.FC<GameListItemProps> = ({
  game,
}: GameListItemProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (!game) return;
    setIsAvailable(game.is_available);
  }, []);

  return (
    <li className="m-2">
      <div className="flex h-24 items-center rounded-md bg-white shadow-md">
        <Link
          className={`${!isAvailable && 'opacity-40'} flex w-8/12 items-center`}
          href={{
            pathname: `/game/${game.id}`,
            query: { bgg_id: game.bgg_id, is_available: isAvailable },
          }}
        >
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden truncate rounded-l-md">
            <Image
              src={game.img_url}
              alt={game.name}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
              priority
            />
          </div>

          <div className="ml-4 mt-2">
            <h2 className="text-md">{game.name}</h2>
          </div>
        </Link>

        <GameUpdateButtonList
          gameId={game.id}
          setAvailable={false}
          text="ausgeliehen"
          updateFunction={setIsAvailable}
        />
        <GameUpdateButtonList
          gameId={game.id}
          setAvailable={true}
          text="zurück gebracht"
          updateFunction={setIsAvailable}
        />
      </div>
    </li>
  );
};

export default GameListItem;
