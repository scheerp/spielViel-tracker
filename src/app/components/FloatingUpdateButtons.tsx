'use client';

import { useSession } from 'next-auth/react';
import { Game } from '../page';
import GameUpdateButton from './GameUpdateButton';

type FloatingGameUpdateButtonsProps = {
  game: Game;
  handleSuccess?: (updatedGameData: Game | undefined) => void;
};

const FloatingUpdateButtons = ({
  game,
  handleSuccess,
}: FloatingGameUpdateButtonsProps) => {
  const { data: session } = useSession();

  return session ? (
    <div className="sticky bottom-6 z-10 mr-5 flex justify-end">
      <div className="flex w-44 items-center justify-center gap-4 rounded-xl bg-white p-4 shadow-[0_8px_15px_rgba(0,0,0,0.3)] md:bottom-8 md:right-7 md:w-64 md:gap-5 md:p-4">
        <GameUpdateButton
          game={game}
          operation="borrow"
          buttonType="detail"
          onSuccess={handleSuccess}
        />
        <GameUpdateButton
          game={game}
          operation="return"
          buttonType="detail"
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  ) : null;
};

export default FloatingUpdateButtons;
