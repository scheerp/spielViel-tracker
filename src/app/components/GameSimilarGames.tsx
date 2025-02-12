'use client';

import { Game } from '@context/GamesContext';
import Image from 'next/image';
import Link from 'next/link';
import ComplexityPill from './ComplexityPill';

const GameSimilarGames = ({ relatedGames }: { relatedGames: Game[] }) => {
  if (!relatedGames || !relatedGames.length) return null;

  return (
    <div className="m-4 mb-8 md:m-8">
      <p className="text-md mb-4 font-bold">Das könnte dir auch gefallen:</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedGames.map((relatedGame) => (
          <div
            key={relatedGame.id + relatedGame.name}
            className="relative flex h-36 flex-row items-center justify-between overflow-hidden rounded-xl bg-white pr-3 shadow-md md:h-48 md:gap-2"
          >
            <Link
              href={`/game/${relatedGame.id}`}
              className={`flex flex-grow items-center md:h-32 md:w-32 ${
                relatedGame.available <= 0 ? 'opacity-40' : ''
              }`}
            >
              <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden truncate md:h-48 md:w-48">
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
              <div className="ml-3 flex h-[7.5rem] flex-col justify-between md:mx-4 md:h-36">
                <h2 className="clamp-custom mb-1 text-xl/6 md:text-lg lg:text-xl">
                  {relatedGame.name}
                </h2>
                <div>
                  {relatedGame.min_players && relatedGame.max_players && (
                    <p className="mb-1 text-sm text-gray-500 md:block">
                      {relatedGame.min_players === relatedGame.max_players
                        ? `${relatedGame?.max_players} Spieler`
                        : `${relatedGame?.min_players} - ${relatedGame?.max_players} Spieler`}{' '}
                      | {relatedGame.player_age}+ <br />
                      {relatedGame.min_playtime === relatedGame.max_playtime
                        ? `${relatedGame?.max_playtime} Min`
                        : `${relatedGame?.min_playtime} - ${relatedGame?.max_playtime} Min`}
                    </p>
                  )}
                  <ComplexityPill
                    complexityName={relatedGame.complexity_label}
                    className="py-1"
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSimilarGames;
