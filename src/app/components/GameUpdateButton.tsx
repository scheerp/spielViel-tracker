'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Game } from '@context/GamesContext';
import useUpdateGame from '@hooks/useUpdateGame';
import TrashIcon from '@icons/TrashIcon';
import { useModal } from '@context/ModalContext';
import Loading from './Loading';

type GameUpdateButtonProps = {
  game: Game;
  operation: 'borrow' | 'return' | 'removeEAN' | 'addEAN';
  text?: string;
  buttonType: 'list' | 'detail' | 'scan';
  onSuccess?: (updatedGame: Game) => void;
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
  const { openModal, closeModal } = useModal();

  const handleUpdateGame = async () => {
    setIsButtonDisabled(true);
    const result = await updateGame({ game, operation });

    if (result?.success && result.gameData && onSuccess) {
      onSuccess(result.gameData);
    }
    setIsButtonDisabled(false);
    closeModal();
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
      'rounded-full  text-xl text-white flex items-center justify-center';
    const sizeStyles =
      buttonType !== 'list'
        ? 'btn min-h-[3.5rem] min-w-[3.5rem] md:min-h-24 md:min-w-24 flex flex-col items-center justify-center max-w-10'
        : 'btnflex h-[3.5rem] w-[3.5rem] flex-col items-center justify-center';

    let availabilityStyles;
    switch (operation) {
      case 'borrow':
        availabilityStyles = 'bg-secondary';
        break;
      case 'return':
        availabilityStyles = 'bg-tertiary';
        break;
      case 'removeEAN':
        availabilityStyles = 'bg-error';
        break;
      case 'addEAN':
        availabilityStyles = 'bg-status';
        break;
    }

    return `${baseStyles} ${sizeStyles} ${availabilityStyles} ${getDisabledStyles()}`;
  };

  if (operation === 'removeEAN') {
    return (
      <button
        onClick={() =>
          openModal((loadingFromContext) => (
            <div className="mt-6 flex flex-col justify-center text-center">
              <p className="mt-10">
                Barcode <b>{game.ean}</b> wirklich enfernen?
              </p>

              <button
                onClick={handleUpdateGame}
                disabled={isButtonDisabled || isLoading}
                className={`btn mt-6 rounded-full bg-primary px-3 py-2.5 font-bold text-white shadow-sm ${
                  isButtonDisabled || isLoading
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
              >
                entfernen!
              </button>
              {loadingFromContext && <Loading />}
            </div>
          ))
        }
        className="flex min-h-16 min-w-16 items-center justify-center rounded-full"
      >
        <div className={getButtonStyles()}>
          {text && buttonType !== 'list' && <span>{text}</span>}
          <TrashIcon />
        </div>
      </button>
    );
  }

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
        width={buttonType === 'list' ? 30 : 40}
        height={buttonType === 'list' ? 30 : 40}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </button>
  );
};

export default GameUpdateButton;
