'use client';

import { useState, useEffect, useRef } from 'react';
import Loading from './Loading';
import useUpdateGame from '@hooks/useUpdateGame';
import { getOperation } from '@lib/utils';
import FloatingUpdateButtons from './FloatingUpdateButtons';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';
import { Game } from '@context/GamesContext';
import DetailedGameImage from './DetailedGameImage';

const Scan: React.FC = () => {
  const [barCode, setBarCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { updateGame, isLoading: isUpdating } = useUpdateGame();
  const { showNotification } = useNotification();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [lastScannedGame, setLastScannedGame] = useState<Game | undefined>(
    undefined,
  );
  const [showFloatingButtons, setShowFloatingButtons] =
    useState<boolean>(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleUpdateOperation = async (data: Game) => {
    const currentOperation = getOperation(data);

    if (currentOperation === 'inconclusive') {
      setShowFloatingButtons(true);
      return;
    }

    const updateGameResult = await updateGame({
      game: data,
      operation: currentOperation,
    });

    if (updateGameResult?.success) {
      setLastScannedGame(updateGameResult.gameData);
      setShowFloatingButtons(false);
      inputRef.current?.focus();
    }
  };

  const handleInput = async () => {
    setLastScannedGame(undefined);
    setError(null);
    setLoading(true);
    setShowFloatingButtons(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/game_by_ean/${String(barCode)}`,
      );

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const data: Game = await response.json();
      setLastScannedGame(data);
      await handleUpdateOperation(data);
    } catch (err) {
      const error = err as AppError;
      setError(error.detail.message);
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
      setLoading(false);
      setBarCode('');
    }
  };

  const handleGameUpdate = (updatedGame: Game) => {
    setLastScannedGame(updatedGame);
    setShowFloatingButtons(false);
    setBarCode('');
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="mb-8 flex flex-col items-center">
        <div className="z-[1] mt-12 flex w-full flex-col justify-around rounded-xl bg-white text-base shadow-md">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleInput();
            }}
          >
            <input
              type="number"
              ref={inputRef}
              readOnly={loading || isUpdating}
              className="h-16 w-full rounded-xl border-0 p-[15px] py-2.5 pt-[10px] outline-none [appearance:textfield] read-only:bg-gray-100 focus:ring-4 focus:ring-primary focus:ring-offset-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Barcode scannen..."
              value={barCode}
              onChange={(event) => setBarCode(event.target.value)}
            />
          </form>
        </div>
      </div>
      <p>Zuletzt gefunden:</p>
      {loading ? (
        <Loading />
      ) : (
        <>
          {error && <div>Spiel nicht gefunden.</div>}
          {lastScannedGame && (
            <div className="mt-9 flex flex-col items-center justify-center md:ml-9">
              <h1 className="mb-6 text-xl font-bold md:text-2xl">
                {lastScannedGame.name}
              </h1>
              <DetailedGameImage game={lastScannedGame} />
            </div>
          )}
          {lastScannedGame && showFloatingButtons && (
            <FloatingUpdateButtons
              game={lastScannedGame}
              handleSuccess={handleGameUpdate}
            />
          )}
        </>
      )}
    </>
  );
};

export default Scan;
