'use client';

import React, { memo, forwardRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Game } from '@context/GamesContext';
import ListUpdateButtons from './ListUpdateButtons';
import ComplexityPill from './ComplexityPill';

type GameListItemProps = {
  game: Game;
};

const GameListItem = memo(
  forwardRef<HTMLLIElement, GameListItemProps>(({ game }, ref) => {
    const { data: session } = useSession();

    return (
      <li
        ref={ref}
        className="relative flex h-36 flex-row items-center justify-between overflow-hidden rounded-xl bg-white pr-3 shadow-md md:h-48 md:gap-2"
      >
        <Link
          href={`/game/${game.id}`}
          className={`flex flex-grow items-center md:h-32 md:w-32 ${
            game.available <= 0 ? 'opacity-40' : ''
          }`}
        >
          <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden truncate md:h-48 md:w-48">
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
            {session && (
              <div className="md:text-md z-1 absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-white shadow-lg md:h-8 md:w-8 md:font-bold">
                {game.available}
              </div>
            )}
          </div>
          <div className="ml-3 flex h-[7.5rem] flex-col justify-between md:mx-4 md:h-36">
            <h2 className="clamp-custom mb-1 text-xl/6 md:text-lg lg:text-xl">
              {game.name}
            </h2>
            <div>
              {game.min_players && game.max_players && (
                <p className="mb-1 text-sm text-gray-500 md:block">
                  {game.min_players === game.max_players
                    ? `${game?.max_players} Spieler`
                    : `${game?.min_players} - ${game?.max_players} Spieler`}{' '}
                  | {game.player_age}+ <br />
                  {game.min_playtime === game.max_playtime
                    ? `${game?.max_playtime} Min`
                    : `${game?.min_playtime} - ${game?.max_playtime} Min`}
                </p>
              )}
              <ComplexityPill complexity={game.complexity} />
            </div>
            {/* <div className="items-star flex flex-col">
              <div className="flex w-56 justify-around text-sm text-gray-500 md:block">
                <GameDetailsProperty
                  value={game.player_age}
                  icon="/player-age.webp"
                  property="player age"
                  context="list"
                />

                <GameDetailsProperty
                  value={
                    game.min_players === game.max_players
                      ? `${game?.max_players}`
                      : `${game?.min_players} - ${game?.max_players}`
                  }
                  icon="/player-count.webp"
                  property="player count"
                  context="list"
                />

                <GameDetailsProperty
                  value={
                    game.min_playtime === game.max_playtime
                      ? `${game?.max_playtime}`
                      : `${game?.min_playtime} - ${game?.max_playtime}`
                  }
                  icon="/playtime.webp"
                  property="playtime"
                  context="list"
                />
              </div>
              <ComplexityPill complexity={game.complexity} />
            </div> */}
          </div>
        </Link>
        {session && <ListUpdateButtons game={game} />}
      </li>
    );
  }),
);

GameListItem.displayName = 'GameListItem';

export default GameListItem;
