'use client';

import Image from "next/image";
import { useState } from 'react';
import { Game } from '../page';
import useUpdateGame from '@hooks/useUpdateGame';
import { useSession } from 'next-auth/react';

type GameUpdateButtonProps = {
  game: Game;
  operation: 'borrow' | 'return';
  text?: string;
  buttonType: 'list' | 'detail' | 'scan';
  onSuccess?: (updatedGameData: Game | undefined) => void;
};

const GameUpdateButton = ({
  game,
  operation,
  text,
  buttonType,
  onSuccess,
}: GameUpdateButtonProps) => {
  const { data: session } = useSession();
  const { updateGame, isLoading } = useUpdateGame();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleUpdateGame = async () => {
    setIsButtonDisabled(true);
    const result = await updateGame({ game, operation });

    if (result?.success && onSuccess) {
      onSuccess(result.gameData);
    }
    setIsButtonDisabled(false);
  };

  const getDisabledStyles = () => {
    const isDisabled =
      isButtonDisabled ||
      isLoading ||
      (operation === 'borrow' && game.available < 1) ||
      (operation === 'return' && game.available >= game.total_copies);

    return isDisabled ? 'cursor-not-allowed opacity-50' : '';
  };

  const getButtonStyles = () => {
    const baseStyles = 'rounded-xl px-2 py-2.5 text-xl text-white';
    const sizeStyles =
      buttonType !== 'list'
        ? 'btn md:m-8 md:mt-4 min-h-32 min-w-32 md:min-h-36 md:min-w-36 flex flex-col items-center justify-center max-w-10'
        : 'btnflex h-16 w-16 flex-col items-center justify-center';
    const availabilityStyles =
      operation === 'borrow' ? 'bg-checkedOut' : 'bg-checkedIn';

    return `${baseStyles} ${sizeStyles} ${availabilityStyles} ${getDisabledStyles()}`;
  };

  return session ? (
    <button
      onClick={handleUpdateGame}
      disabled={isButtonDisabled || isLoading}
      className={getButtonStyles()}
    >
      {text && buttonType !== 'list' && <span>{text}</span>}
      <Image
        src={operation === 'borrow' ? '/lend-icon.svg' : '/return-icon.svg'}
        alt={operation === 'borrow' ? 'lend icon' : 'return icon'}
        width={buttonType === 'list' ? 20 : 40}
        height={buttonType === 'list' ? 20 : 40}
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
    </button>
  ) : null;
};

export default GameUpdateButton;
