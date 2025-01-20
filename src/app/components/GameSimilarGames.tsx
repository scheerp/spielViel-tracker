'use client';

import { Game } from '@context/GamesContext';
import Image from 'next/image';
import Link from 'next/link';

const GameSimilarGames = ({ relatedGames }: { relatedGames: Game[] }) => {
  if (!relatedGames || !relatedGames.length) return null;

  return (
    <div className="m-4 my-8 md:m-8">
      <p className="text-md mb-4 font-bold">Ähnliche Spiele</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedGames.map((relatedGame) => (
          <div
            key={relatedGame.id + relatedGame.name}
            className="relative flex h-24 flex-row items-center justify-between overflow-hidden rounded-xl bg-white pr-2 shadow-md md:h-48 md:gap-4"
          >
            <Link
              href={`/game/${relatedGame.id}`}
              className={`mr-1 flex flex-grow items-center md:h-32 md:w-32 ${
                !relatedGame.available ? 'opacity-40' : ''
              }`}
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden truncate rounded-l-md md:h-48 md:w-48">
                <Image
                  src={
                    relatedGame.img_url ? relatedGame.img_url : '/noImage.jpg'
                  }
                  alt={relatedGame.name}
                  priority
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div className="ml-3 mt-2 flex-grow md:ml-5">
                <h2 className="text-md md:text-lg lg:text-xl">
                  {relatedGame.name}
                </h2>
                <p className="hidden text-sm text-gray-500 md:block">
                  {relatedGame.max_players === relatedGame.min_players
                    ? `${relatedGame?.max_players} Spieler`
                    : `${relatedGame?.min_players} - ${relatedGame?.max_players} Spieler`}
                </p>
                <p className="hidden text-sm text-gray-500 md:block">
                  {relatedGame.max_playtime === relatedGame.min_playtime
                    ? `ca. ${relatedGame.playing_time} Minuten`
                    : `ca. ${relatedGame.min_playtime} - ${relatedGame.max_playtime} Minuten`}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSimilarGames;
