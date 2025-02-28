import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { useState } from 'react';
import Image from 'next/image';
import { AppError, BarcodeConflictError } from '../types/ApiError';
import { Game, useGames } from '@context/GamesContext';

export type useUpdateGameArguments = {
  game: Game;
  operation: 'borrow' | 'return' | 'removeEAN' | 'addEAN' | 'updateFamiliarity';
  ean?: string;
  familiarity?: number;
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
    familiarity,
  }: useUpdateGameArguments) => {
    if (!session) {
      console.error('Keine Sitzung gefunden.');
      return { error: 'No session' };
    }

    setIsLoading(true);

    try {
      let endpoint = '';
      let body: Record<string, unknown> = {};

      switch (operation) {
        case 'borrow':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/games/game/borrow/${game.id}`;
          break;
        case 'return':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/games/game/return/${game.id}`;
          break;
        case 'addEAN':
          if (!ean) throw new Error('EAN is required for addEAN operation');
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/games/game/add_ean/${game.id}`;
          body = { ean };
          break;
        case 'removeEAN':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/games/game/remove_ean/${game.id}`;
          break;
        case 'updateFamiliarity':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/helper/${game.id}/familiarity`;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        ...(operation === 'addEAN' && { body: JSON.stringify(body) }),
        ...(operation === 'updateFamiliarity' && {
          body: JSON.stringify({
            game_id: game.id,
            familiarity,
            user_id: session?.user?.id,
          }),
        }),
      });

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const updatedGame: Game = await response.json();
      console.log('Updated game:', updatedGame);

      updateGlobalGame(updatedGame);

      const actionMessage = {
        borrow: 'erfolgreich ausgeliehen.',
        return: 'erfolgreich zurückgegeben.',
        addEAN: 'Barcode erfolgreich hinzugefügt.',
        removeEAN: 'Barcode erfolgreich entfernt.',
        updateFamiliarity: 'Familiarity erfolgreich aktualisiert.',
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
          operation === 'addEAN' ||
          operation === 'removeEAN' ||
          operation === 'updateFamiliarity'
            ? 'success'
            : operation,
        duration: 2000,
      });

      return { success: true, gameData: updatedGame };
    } catch (err) {
      const error = err as BarcodeConflictError;
      if (
        error.detail.error_code === 'BARCODE_CONFLICT' &&
        error.detail.ean_details
      ) {
        const error = err as BarcodeConflictError;
        return showNotification({
          message: (
            <div className="flex items-center">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
                <Image
                  src={
                    error.detail.ean_details.thumbnail_url
                      ? error.detail.ean_details.thumbnail_url
                      : '/noImage.jpg'
                  }
                  alt={error.detail.ean_details.name}
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
                {error.detail.ean_details.name}
              </span>
            </div>
          ),
          type: 'error',
          duration: 5000,
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
