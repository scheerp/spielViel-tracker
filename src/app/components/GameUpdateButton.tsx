'use client';

import { useNotification } from '@context/NotificationContext';
import { useSession } from 'next-auth/react';
import Image from 'next/legacy/image';
import { useState } from 'react';

type GameUpdateButtonProps = {
  gameId: number;
  setAvailable: boolean;
  text?: string;
  buttonType: 'list' | 'detail';
  updateFunction: (isAvailable: boolean) => void;
};

const GameUpdateButton = ({
  gameId,
  setAvailable,
  text,
  buttonType,
  updateFunction,
}: GameUpdateButtonProps) => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleUpdateGame = async () => {
    if (!session) return;

    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/update_game/${gameId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ is_available: setAvailable }),
        },
      );

      if (response.ok) {
        const actionMessage = setAvailable
          ? 'Spiel erfolgreich zurück gegeben.'
          : 'Spiel erfolgreich ausgeliehen.';
        const iconSrc = setAvailable ? '/return-icon.svg' : '/lend-icon.svg';

        showNotification({
          message: (
            <div className="flex items-center">
              <Image src={iconSrc} alt="status icon" width={20} height={20} />
              <span className="ml-4">{actionMessage}</span>
            </div>
          ),
          type: setAvailable ? 'checkIn' : 'checkOut',
          duration: 1500,
        });
        updateFunction(setAvailable);
      } else {
        showNotification({
          message: 'Fehler beim Aktualisieren des Spiels.',
          type: 'error',
          duration: 1000,
        });
      }
    } catch (error) {
      console.error('Fehler beim Senden des PUT-Requests:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsButtonDisabled(false);
      }, 500);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = 'rounded-xl px-2 py-2.5 text-xl text-white';
    const sizeStyles =
      buttonType === 'detail'
        ? 'btn m-8 mt-4 min-h-36 min-w-36 flex flex-col items-center justify-center'
        : 'btnflex mr-1 h-16 w-16 flex-col items-center justify-center';
    const availabilityStyles = setAvailable ? 'bg-checkedIn' : 'bg-checkedOut';
    const disabledStyles =
      isButtonDisabled || isLoading ? 'cursor-not-allowed opacity-50' : '';

    return `${baseStyles} ${sizeStyles} ${availabilityStyles} ${disabledStyles}`;
  };

  return session ? (
    <button
      onClick={handleUpdateGame}
      disabled={isButtonDisabled}
      className={getButtonStyles()}
    >
      {text && buttonType === 'detail' && <span>{text}</span>}
      <Image
        src={setAvailable ? '/return-icon.svg' : '/lend-icon.svg'}
        alt={setAvailable ? 'return icon' : 'lend icon'}
        width={buttonType === 'detail' ? 40 : 20}
        height={buttonType === 'detail' ? 40 : 20}
      />
    </button>
  ) : null;
};

export default GameUpdateButton;
