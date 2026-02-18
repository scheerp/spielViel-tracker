'use client';

import { Game } from '@context/GamesContext';
import Image from 'next/image';
import Link from 'next/link';
import ComplexityPill from './ComplexityPill';
import { useFeedback } from '@context/FeedbackContext';
import Clickable from './Clickable';

const GameSimilarGames = ({ relatedGames }: { relatedGames: Game[] }) => {
  const { addInteraction } = useFeedback();
  if (!relatedGames || !relatedGames.length) return null;

  return (
    <div className="m-4 mb-8 md:m-8">
      <h3 className="text-md mb-4 text-lg font-semibold">
        Das könnte dir auch gefallen:
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedGames.map((relatedGame) => (
          <Clickable
            key={relatedGame.id + relatedGame.name}
            className="s relative flex h-36 flex-row items-center justify-between overflow-hidden bg-backgroundDark pr-3 md:h-48 md:gap-2"
          >
            <Link
              href={`/game/${relatedGame.id}`}
              className={`flex flex-grow items-center md:h-32 md:w-32 ${
                relatedGame.available <= 0 ? 'opacity-40' : ''
              }`}
              onClick={() => addInteraction(1)}
            >
              <div className="relative m-2 h-32 w-32 flex-shrink-0 overflow-hidden truncate rounded-lg border-[3px] border-foreground md:h-44 md:w-44">
                <Image
                  src={
                    relatedGame.img_url
                      ? relatedGame.img_url
                      : '/placeholder.png'
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
              <div className="ml-3 flex h-[7.9rem] flex-col justify-between md:mx-4 md:h-44">
                <h2 className="clamp-custom-2 mb-1 text-xl/6 font-semibold [font-stretch:125%] md:text-lg lg:text-xl">
                  {relatedGame.name}
                </h2>
                <div>
                  {relatedGame.min_players && relatedGame.max_players && (
                    <p className="mb-1 text-sm text-gray-500 md:block">
                      {relatedGame.min_players === relatedGame.max_players
                        ? `${relatedGame?.max_players} Spieler*innen`
                        : `${relatedGame?.min_players} - ${relatedGame?.max_players} Spieler*innen`}{' '}
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
          </Clickable>
        ))}
      </div>
    </div>
  );
};

export default GameSimilarGames;
