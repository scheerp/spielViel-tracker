'use client';

import { useNotification } from '@context/NotificationContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

const GameUpdateButton = ({
  gameId,
  setAvailable,
  text,
  updateFunction,
}: {
  gameId: number;
  setAvailable: boolean;
  text: string;
  updateFunction: (arg0: boolean) => void;
}) => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleUpdateGame = async () => {
    if (session) {
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
          showNotification({
            message: 'Spiel erfolgreich aktualisiert!',
            type: 'success',
            duration: 1000,
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
    }
  };

  return session ? (
    <button
      onClick={handleUpdateGame}
      disabled={isButtonDisabled}
      className={`btn m-8 mt-4 flex min-h-36 min-w-36 flex-col items-center justify-center rounded-xl px-2 py-2.5 text-xl text-white ${!setAvailable ? 'bg-orange-400' : 'bg-lime-500'} ${isButtonDisabled || isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {isLoading ? 'Wird aktualisiert...' : text}
      {setAvailable ? (
        <Image
          className="mr-2"
          src="/lend-icon.svg"
          alt={'lend icon'}
          width={40}
          height={40}
        />
      ) : (
        <Image
          className="mr-2"
          src="/return-icon.svg"
          alt={'return icon'}
          width={40}
          height={40}
        />
      )}
    </button>
  ) : null;
};

export default GameUpdateButton;
