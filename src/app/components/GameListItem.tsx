'use client';

import React, { memo, forwardRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import ListUpdateButtons from './ListUpdateButtons';
import ComplexityPill from './ComplexityPill';
import useUpdateGame from '@hooks/useUpdateGame';
import ExplainersList from './ExplainersList';
import Loading from './Loading';
import { useModal } from '@context/ModalContext';
import { Game } from '@context/GamesContext';
import ThumbIcon from '@icons/ThumbIcon';
import { FamiliarityMapping } from '@lib/utils';
import { useFeedback } from '@context/FeedbackContext';
import FavouriteOffIcon from '@icons/FavouriteOffIcon';
import FavouriteOnIcon from '@icons/FavouriteOnIcon';
import Clickable from './Clickable';

type GameListItemProps = {
  game: Game;
  editFamiliarity: boolean;
  isFavourite: boolean;
  toggleFavourite: () => void;
};

const GameListItem = memo(
  forwardRef<HTMLLIElement, GameListItemProps>(
    ({ game, editFamiliarity, isFavourite, toggleFavourite }, ref) => {
      const { data: session } = useSession();
      const { updateGame } = useUpdateGame();
      const { openModal } = useModal();
      const { addInteraction } = useFeedback();

      const [currentFamiliarity, setCurrentFamiliarity] = useState<number>(
        game.my_familiarity || 0,
      );
      const updateFamiliarity = async (value: number) => {
        if (value === currentFamiliarity) return;

        await updateGame({
          game,
          operation: 'updateFamiliarity',
          familiarity: value,
        });

        setCurrentFamiliarity(value);
      };

      return (
        <Clickable
          as="li"
          ref={ref}
          className="relative flex h-36 flex-row items-center justify-between overflow-hidden rounded-xl border-[3px] border-foreground bg-backgroundDark pr-2 shadow-darkBottom md:h-48 md:gap-2"
        >
          <div className="flex flex-grow items-center md:h-32 md:w-32">
            {editFamiliarity ? (
              <>
                <button
                  onClick={() =>
                    openModal((loadingFromContext) => (
                      <>
                        <ExplainersList game={game} displaySlider={false} />
                        {loadingFromContext && <Loading />}
                      </>
                    ))
                  }
                  className={`${game.available <= 0 ? 'opacity-40' : ''}`}
                >
                  <div className="relative m-2 h-32 w-32 flex-shrink-0 overflow-hidden truncate rounded-lg border-[3px] border-foreground bg-white md:h-44 md:w-44">
                    <Image
                      src={game.img_url ? game.img_url : '/placeholder.png'}
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
                </button>
                <div className="flex h-[7.8rem] w-full flex-col justify-between md:h-[9.3rem]">
                  <h2 className="clamp-custom-1 ml-3 text-xl/6 md:ml-4 md:text-lg lg:text-xl">
                    {game.name}
                  </h2>

                  <div className="flex flex-col items-center justify-center pl-3">
                    <p className="mb-2 text-sm text-gray-500 md:block">
                      Wie gut kannst du das Spiel erklären?
                    </p>

                    <div className="flex w-full items-center justify-around">
                      <button
                        onClick={() => updateFamiliarity(1)}
                        className={`flex h-14 w-14 min-w-12 items-center justify-center rounded-full transition-all duration-300 md:h-12 md:w-12 lg:h-14 lg:w-14 ${FamiliarityMapping.UNKNOWN.color} ${currentFamiliarity !== 1 && 'opacity-50'}`}
                      >
                        <ThumbIcon className={`h-7 w-7 rotate-180`} />
                      </button>
                      <button
                        onClick={() => updateFamiliarity(2)}
                        className={`flex h-14 w-14 min-w-12 items-center justify-center rounded-full transition-all duration-300 md:h-12 md:w-12 lg:h-14 lg:w-14 ${FamiliarityMapping.NEULING.color} ${currentFamiliarity !== 2 && 'opacity-50'}`}
                      >
                        <ThumbIcon className="h-7 w-7 rotate-90" />
                      </button>
                      <button
                        onClick={() => updateFamiliarity(3)}
                        className={`flex h-14 w-14 min-w-12 items-center justify-center rounded-full transition-all duration-300 md:h-12 md:w-12 lg:h-14 lg:w-14 ${FamiliarityMapping.PROFI.color} ${currentFamiliarity !== 3 && 'opacity-50'}`}
                      >
                        <ThumbIcon className="h-7 w-7" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={
                    'absolute left-[-2px] top-[-1px] z-10 md:top-[-5px]'
                  }
                >
                  {isFavourite ? (
                    <button
                      className="h-12 w-12 md:h-16 md:w-16"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavourite();
                      }}
                    >
                      <FavouriteOnIcon className="h-10 w-10 md:h-12 md:w-12" />
                    </button>
                  ) : (
                    <button
                      className="h-12 w-12 md:h-16 md:w-16"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavourite();
                      }}
                    >
                      <FavouriteOffIcon className="h-10 w-10 md:h-12 md:w-12" />
                    </button>
                  )}
                </div>
                <Link
                  href={`/game/${game.id}`}
                  className={`${game.available <= 0 ? 'opacity-40' : ''}`}
                  onClick={() => addInteraction(1)}
                >
                  <div className="relative m-2 h-32 w-32 flex-shrink-0 overflow-hidden truncate rounded-lg border-[3px] border-foreground bg-white md:h-44 md:w-44">
                    <Image
                      src={game.img_url ? game.img_url : '/placeholder.png'}
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
                </Link>
                <div className="flex flex-grow items-center">
                  <Link
                    href={`/game/${game.id}`}
                    className={`flex flex-grow items-center md:h-32 md:w-24 ${game.available <= 0 ? 'opacity-40' : ''}`}
                    onClick={() => addInteraction(1)}
                  >
                    <div className="ml-3 flex h-[7.9rem] flex-col justify-between md:mx-4 md:h-[9.8rem]">
                      <h2 className="clamp-custom-2 mb-1 text-xl/6 font-semibold [font-stretch:125%] md:text-lg lg:text-xl">
                        {game.name}
                      </h2>
                      <div>
                        {game.min_players && game.max_players && (
                          <p className="mb-1 text-sm text-gray-500 md:block">
                            {game.min_players === game.max_players
                              ? `${game?.max_players} Spieler*innen`
                              : `${game?.min_players} - ${game?.max_players} Spieler*innen`}{' '}
                            <br />
                            {game.min_playtime === game.max_playtime
                              ? `${game?.max_playtime} Min`
                              : `${game?.min_playtime} - ${game?.max_playtime} Min`}{' '}
                            | {game.player_age}+
                          </p>
                        )}
                        <ComplexityPill
                          complexityName={game.complexity_label}
                          className="py-1"
                        />
                      </div>
                    </div>
                  </Link>

                  {session && <ListUpdateButtons game={game} />}
                </div>
              </>
            )}
          </div>
        </Clickable>
      );
    },
  ),
);

GameListItem.displayName = 'GameListItem';

export default GameListItem;
