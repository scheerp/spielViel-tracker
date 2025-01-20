'use client';

import React, { memo, forwardRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import CustomModal from './CustomModal';
import BarcodeIcon from '@icons/BarcodeIcon';
import AddEAN from './AddEAN';
import { Game } from '@context/GamesContext';
import ListUpdateButtons from './ListUpdateButtons';

type GameListItemProps = {
  game: Game;
};

const GameListItem = memo(
  forwardRef<HTMLLIElement, GameListItemProps>(({ game }, ref) => {
    const { data: session } = useSession();

    const renderButtons = () => {
      if (session) {
        if (!game.ean) {
          return (
            <>
              <CustomModal
                trigger={
                  <div className="flex items-center justify-center rounded-xl bg-primary p-2">
                    <BarcodeIcon tailwindColor="text-white" />
                  </div>
                }
              >
                <AddEAN game={game} />
              </CustomModal>
            </>
          );
        }

        return <ListUpdateButtons game={game} />;
      }
      return null;
    };

    return (
      <li
        ref={ref}
        className="relative flex h-24 flex-row items-center justify-between overflow-hidden rounded-xl bg-white pr-2 shadow-md md:h-48 md:gap-4"
      >
        <Link
          href={`/game/${game.id}`}
          className={`mr-1 flex flex-grow items-center md:h-32 md:w-32 ${
            game.available <= 0 ? 'opacity-40' : ''
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
            <div className="md:text-md z-1 absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-white shadow-lg md:h-8 md:w-8 md:font-bold">
              {game.available}
            </div>
          </div>
          <div className="ml-3 mt-2 flex-grow md:ml-5">
            <h2 className="text-md md:text-lg lg:text-xl">{game.name}</h2>
            <p className="hidden text-sm text-gray-500 md:block">
              {game.min_players} - {game.max_players} Spieler
            </p>
            <p className="hidden text-sm text-gray-500 md:block">
              {game.min_playtime} - {game.max_playtime} Minuten
            </p>
          </div>
        </Link>
        {renderButtons()}
      </li>
    );
  }),
);

GameListItem.displayName = 'GameListItem';

export default GameListItem;
