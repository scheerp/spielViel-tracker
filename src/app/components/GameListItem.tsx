'use client';

import React, { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { Game } from '../page';
import GameUpdateButton from './GameUpdateButton';

type GameListItemProps = {
  game: Game;
  updateGameAvailability: (gameId: number, isAvailable: boolean) => void;
};

const GameListItem: React.FC<GameListItemProps> = memo(
  ({ game, updateGameAvailability }) => {
    const [isAvailable, setIsAvailable] = useState<boolean>(game.is_available);

    useEffect(() => {
      setIsAvailable(game.is_available);
    }, [game.is_available]);

    return (
      <li className="flex h-24 flex-row items-center justify-between overflow-hidden rounded-md bg-white pr-2 shadow-md md:gap-4">
        <Link
          href={`/game/${game.id}`}
          className={`mr-1 flex flex-grow items-center md:h-32 md:w-32 ${
            !isAvailable ? 'opacity-40' : ''
          }`}
        >
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden truncate rounded-l-md">
            <Image
              src={game.img_url ? game.img_url : '/noImage.jpg'}
              alt={game.name}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
              priority
            />
          </div>
          <div className="ml-3 mt-2 flex-grow">
            <h2 className="text-md">{game.name}</h2>
            <p className="hidden text-sm text-gray-500">
              {game.min_players} - {game.max_players} Spieler
            </p>
          </div>
        </Link>
        <div className="flex gap-2">
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
      </li>
    );
  },
);

GameListItem.displayName = 'GameListItem';

export default GameListItem;
