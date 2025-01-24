import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { useState } from 'react';
import Image from 'next/image';
import { AppError, BarcodeConflictError } from '../types/ApiError';
import { Game, useGames } from '@context/GamesContext';

export type useUpdateGameArguments = {
  game: Game;
  operation: 'borrow' | 'return' | 'addEAN';
  ean?: number;
};

const useUpdateGame = () => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const { updateGame: updateGlobalGame } = useGames();
  const [isLoading, setIsLoading] = useState(false);

  const updateGame = async ({
    game,
    operation,
    ean,
  }: useUpdateGameArguments) => {
    if (!session) {
      console.error('Keine Sitzung gefunden.');
      return { error: 'No session' };
    }

    setIsLoading(true);

    try {
      let endpoint = '';
      let body: Record<string, unknown> = {};

      if (operation === 'borrow') {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/borrow_game/${game.id}`;
      } else if (operation === 'return') {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/return_game/${game.id}`;
      } else if (operation === 'addEAN') {
        if (!ean) throw new Error('EAN is required for addEAN operation');
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/add_ean/${game.id}`;
        body = { ean };
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        ...(operation === 'addEAN' && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const updatedGame: Game = await response.json();

      updateGlobalGame(updatedGame);

      const actionMessage = {
        borrow: 'erfolgreich ausgeliehen.',
        return: 'erfolgreich zurückgegeben.',
        addEAN: 'Barcode erfolgreich hinzugefügt.',
      }[operation];

      showNotification({
        message: (
          <div className="flex items-center">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
              <Image
                src={
                  updatedGame.thumbnail_url
                    ? updatedGame.thumbnail_url
                    : '/noImage.jpg'
                }
                alt={updatedGame.name}
                priority
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
            <span className="ml-4">
              {updatedGame.name}
              <br />
              {actionMessage}
            </span>
          </div>
        ),
        type:
          operation === 'addEAN'
            ? 'success'
            : operation === 'borrow'
              ? 'checkOut'
              : 'checkIn',
        duration: 2000,
      });

      return { success: true, gameData: updatedGame };
    } catch (err) {
      const error = err as AppError;
      if (
        error.detail.error_code === 'BARCODE_CONFLICT' &&
        error.detail.details
      ) {
        const error = err as BarcodeConflictError;
        return showNotification({
          message: (
            <div className="flex items-center">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
                <Image
                  src={
                    error.detail.details.thumbnail_url
                      ? error.detail.details.thumbnail_url
                      : '/noImage.jpg'
                  }
                  alt={error.detail.details.name}
                  priority
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
              <span className="ml-4">
                {'Barcode bereits vorhanden bei:'}
                <br />
                {error.detail.details.name}
              </span>
            </div>
          ),
          type: 'error',
          duration: 4000,
        });
      }

      showNotification({
        message: (
          <div>
            Fehler:
            <br />{' '}
            {error.detail?.message || 'Ein unbekannter Fehler ist aufgetreten'}
          </div>
        ),
        type: 'error',
        duration: 3000,
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateGame, isLoading };
};

export default useUpdateGame;
