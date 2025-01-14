'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Game } from '../page';
import useUpdateGame from '@hooks/useUpdateGame';

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
      (operation === 'return' && game.available >= game.quantity);

    return isDisabled ? 'cursor-not-allowed opacity-50' : '';
  };

  const getButtonStyles = () => {
    const baseStyles =
      'rounded-xl px-2 py-2.5 text-xl text-white flex items-center justify-center';
    const sizeStyles =
      buttonType !== 'list'
        ? 'btn min-h-16 min-w-16 md:min-h-24 md:min-w-24 flex flex-col items-center justify-center max-w-10'
        : 'btnflex h-16 w-16 flex-col items-center justify-center';
    const availabilityStyles =
      operation === 'borrow' ? 'bg-checkedOut' : 'bg-checkedIn';

    return `${baseStyles} ${sizeStyles} ${availabilityStyles} ${getDisabledStyles()}`;
  };

  return (
    <button
      onClick={handleUpdateGame}
      disabled={isButtonDisabled || isLoading}
      className={getButtonStyles()}
    >
      {text && buttonType !== 'list' && <span>{text}</span>}
      <Image
        src={operation === 'borrow' ? '/lend-icon.svg' : '/return-icon.svg'}
        alt={operation === 'borrow' ? 'lend icon' : 'return icon'}
        width={buttonType === 'list' ? 20 : 30}
        height={buttonType === 'list' ? 20 : 30}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </button>
  );
};

export default GameUpdateButton;
