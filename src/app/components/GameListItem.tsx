'use client';

import React, { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '../page';
import { useSession } from 'next-auth/react';
import CustomModal from './CustomModal';
import BarcodeIcon from '@icons/BarcodeIcon';
import AddEAN from './AddEAN';
import ListUpdateButtons from './ListUpdateButtons';

type GameListItemProps = {
  game: Game;
};

const GameListItem: React.FC<GameListItemProps> = memo(({ game }) => {
  const [available, setAvailable] = useState<number>(game.available);
  const { data: session } = useSession();

  useEffect(() => {
    setAvailable(game.available);
  }, [game.available]);

  const renderButtons = () => {
    if (session) {
      if (!game.ean) {
        return (
          <>
            <div className="md:text-md z-1 absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-white shadow-lg md:h-8 md:w-8 md:font-bold">
              {available}
            </div>

            <div className="flex items-center justify-center rounded-xl bg-primary p-2">
              <CustomModal trigger={<BarcodeIcon tailwindColor="text-white" />}>
                <AddEAN game={game} />
              </CustomModal>
            </div>
          </>
        );
      }
      return (
        <>
          <div className="md:text-md z-1 absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-white shadow-lg md:h-8 md:w-8 md:font-bold">
            {available}
          </div>
          <ListUpdateButtons game={game} />
        </>
      );
    }

    return undefined;
  };

  return (
    <li className="relative flex h-24 flex-row items-center justify-between overflow-hidden rounded-xl bg-white pr-2 shadow-md md:h-48 md:gap-4">
      <Link
        href={`/game/${game.id}`}
        className={`mr-1 flex flex-grow items-center md:h-32 md:w-32 ${
          !available ? 'opacity-40' : ''
        }`}
      >
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden truncate rounded-l-md md:h-48 md:w-48">
          <Image
            src={game.img_url ? game.img_url : '/noImage.jpg'}
            alt={game.name}
            priority
            fill
            sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <div className="ml-3 mt-2 flex-grow md:ml-5">
          <h2 className="text-md md:text-lg lg:text-xl">{game.name}</h2>
          <p className="hidden text-sm text-gray-500 md:block">
            {game.max_players === game.min_players
              ? `${game?.max_players} Spieler`
              : `${game?.min_players} - ${game?.max_players} Spieler`}
          </p>
          <p className="hidden text-sm text-gray-500 md:block">
            {game.max_playtime === game.min_playtime
              ? `ca. ${game.playing_time} Minuten`
              : `ca. ${game.min_playtime} - ${game.max_playtime} Minuten`}
          </p>
        </div>
      </Link>
      {renderButtons()}
    </li>
  );
});

GameListItem.displayName = 'GameListItem';

export default GameListItem;
