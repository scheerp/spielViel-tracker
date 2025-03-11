'use client';

import { useSession } from 'next-auth/react';
import GameUpdateButton from './GameUpdateButton';
import { Game } from '@context/GamesContext';

type FloatingGameUpdateButtonsProps = {
  game: Game;
  handleSuccess: (updatedGameData: Game) => void;
  showDeleteBarcodeButton?: boolean;
};

const FloatingUpdateButtons = ({
  game,
  handleSuccess,
  showDeleteBarcodeButton = false,
}: FloatingGameUpdateButtonsProps) => {
  const { data: session } = useSession();

  return session ? (
    <div className="pointer-events-none sticky bottom-6 z-10 mr-5 flex justify-end">
      <div className="pointer-events-auto flex items-center justify-center gap-4 rounded-xl bg-white p-4 shadow-[0_8px_15px_rgba(0,0,0,0.3)] md:bottom-8 md:right-7 md:gap-5 md:p-4">
        {game.ean !== null &&
          session?.user?.role === 'admin' &&
          showDeleteBarcodeButton && (
            <GameUpdateButton
              game={game}
              operation="removeEAN"
              buttonType="detail"
              onSuccess={handleSuccess}
            />
          )}
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
