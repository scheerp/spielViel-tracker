'use client';

import { useNotification } from '@context/NotificationContext';
import { useSession } from 'next-auth/react';
import Image from 'next/legacy/image';
import { useState } from 'react';

const GameUpdateButtonList = ({
  gameId,
  setAvailable,
  updateFunction,
}: {
  gameId: number;
  setAvailable: boolean;
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
          const notificationMessage = setAvailable
            ? 'Spiel erfolgreich zurück gegeben.'
            : 'Spiel erfolgreich ausgeliehen.';
          showNotification({
            message: notificationMessage,
            type: 'success',
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
    }
  };

  return session ? (
    <button
      onClick={handleUpdateGame}
      disabled={isButtonDisabled}
      className={`btnflex mr-1 h-16 w-16 flex-col items-center justify-center rounded-xl px-2 py-2.5 text-xl text-white ${!setAvailable ? 'bg-orange-500' : 'bg-cyan-600'} ${isButtonDisabled || isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {setAvailable ? (
        <Image
          className="mr-2"
          src="/return-icon.svg"
          alt={'return icon'}
          width={20}
          height={20}
        />
      ) : (
        <Image
          className="mr-2"
          src="/lend-icon.svg"
          alt={'lend icon'}
          width={20}
          height={20}
        />
      )}
    </button>
  ) : null;
};

export default GameUpdateButtonList;
