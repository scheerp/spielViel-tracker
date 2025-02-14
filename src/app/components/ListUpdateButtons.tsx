'use client';

import { useSession } from 'next-auth/react';
import GameUpdateButton from './GameUpdateButton';
import { Game } from '@context/GamesContext';
import CustomModal from './CustomModal';
import BarcodeIcon from '@icons/BarcodeIcon';
import AddEAN from './AddEAN';

type ListUpdateButtonsProps = {
  game: Game;
};

const ListUpdateButtons = ({ game }: ListUpdateButtonsProps) => {
  const { data: session } = useSession();
  if (session) {
    if (game.ean === null) {
      return (
        <CustomModal
          trigger={
            <div className="flex min-h-16 min-w-16 items-center justify-center rounded-xl bg-status p-2">
              <BarcodeIcon tailwindColor="text-white" />
            </div>
          }
        >
          <AddEAN game={game} />
        </CustomModal>
      );
    }
    return (
      <div className="z-10 flex flex-col gap-1 md:gap-3">
        <GameUpdateButton game={game} operation={'borrow'} buttonType="list" />
        <GameUpdateButton game={game} operation={'return'} buttonType="list" />
      </div>
    );
  }

  return null;
};

export default ListUpdateButtons;
