import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { useState } from 'react';
import { Game } from '../page';
import Image from "next/legacy/image";
import { AppError } from '../types/ApiError';

type useUpdateGameArguments = {
  game: Game;
  operation: 'borrow' | 'return';
};

const useUpdateGame = () => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const updateGame = async ({ game, operation }: useUpdateGameArguments) => {
    if (!session) {
      console.error('Keine Sitzung gefunden.');
      return { error: 'No session' };
    }

    setIsLoading(true);

    try {
      const endpoint =
        operation === 'borrow'
          ? `${process.env.NEXT_PUBLIC_API_URL}/borrow_game/${game.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/return_game/${game.id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const data: Game = await response.json();

      const actionMessage =
        operation === 'borrow'
          ? 'erfolgreich ausgeliehen.'
          : 'erfolgreich zurück gegeben.';

      showNotification({
        message: (
          <div className="flex items-center">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
              <Image
                src={game.thumbnail_url ? game.thumbnail_url : '/noImage.jpg'}
                alt={game.name}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                priority
              />
            </div>
            <span className="ml-4">
              {game.name}
              <br />
              {actionMessage}
            </span>
          </div>
        ),
        type: operation === 'borrow' ? 'checkOut' : 'checkIn',
        duration: 1500,
      });

      return { success: true, gameData: data };
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: (
          <div>
            Fehler:
            <br /> {error.detail.message}
          </div>
        ),
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateGame, isLoading };
};

export default useUpdateGame;
