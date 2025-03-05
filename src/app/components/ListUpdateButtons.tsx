'use client';

import { useSession } from 'next-auth/react';
import GameUpdateButton from './GameUpdateButton';
import { Game } from '@context/GamesContext';
import BarcodeIcon from '@icons/BarcodeIcon';
import AddEAN from './AddEAN';
import { useModal } from '@context/ModalContext';
import Loading from './Loading';

type ListUpdateButtonsProps = {
  game: Game;
};

const ListUpdateButtons = ({ game }: ListUpdateButtonsProps) => {
  const { data: session } = useSession();
  const { openModal } = useModal();
  if (session) {
    if (game.ean === null) {
      return (
        <button
          onClick={() =>
            openModal((loadingFromContext) => (
              <>
                <AddEAN game={game} />
                {loadingFromContext && <Loading />}
              </>
            ))
          }
          className="flex min-h-16 min-w-16 items-center justify-center rounded-xl bg-status p-2"
        >
          <BarcodeIcon tailwindColor="text-white" />
        </button>
      );
    }
    return (
      <div className="z-[9] flex flex-col gap-1 md:gap-3">
        <GameUpdateButton game={game} operation={'borrow'} buttonType="list" />
        <GameUpdateButton game={game} operation={'return'} buttonType="list" />
      </div>
    );
  }

  return null;
};

export default ListUpdateButtons;
