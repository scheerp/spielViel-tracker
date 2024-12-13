'use client';

import { useState, useEffect, useRef } from 'react';
import { Game } from '../page';
import Loading from './Loading';
import Image from 'next/image';
import useUpdateGame from '@hooks/useUpdateGame';
import { getOperation, OperationType } from '@lib/utils';
import GameUpdateButton from './GameUpdateButton';

const Scan: React.FC = () => {
  const [barCode, setBarCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<OperationType>();
  const { updateGame, isLoading: isUpdating } = useUpdateGame();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [lastScannedGame, setLastScannedGame] = useState<Game | undefined>(
    undefined,
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInconclusiveUpdate = (data: Game | undefined) => {
    setLastScannedGame(data);
    setOperation(undefined);
    inputRef.current?.focus();
  };

  const handleUpdateOperation = async (data: Game) => {
    let updateGameResult;

    if (data) {
      switch (getOperation(data)) {
        case 'borrow':
          updateGameResult = await updateGame({
            game: data,
            operation: 'borrow',
          });

          if (updateGameResult.success) {
            setLastScannedGame(updateGameResult.gameData);
            setOperation(undefined);
          }
          break;

        case 'return':
          updateGameResult = await updateGame({
            game: data,
            operation: 'return',
          });

          if (updateGameResult.success) {
            setLastScannedGame(updateGameResult.gameData);
            setOperation(undefined);
          }
          break;

        case 'inconclusive':
          setOperation('inconclusive');
          break;
      }
    }
  };

  const handleInput = async () => {
    setLastScannedGame(undefined);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/game_by_ean/${Number(barCode)}`,
      );

      if (!response.ok) {
        throw new Error('Spiel nicht gefunden');
      }

      const data: Game = await response.json();
      setLastScannedGame(data);
      handleUpdateOperation(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setBarCode('');
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-col items-center">
        <div className="z-[1] mt-8 flex w-full flex-col justify-around rounded-md bg-white text-base shadow-md md:w-[50%]">
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
              className="h-16 w-full rounded-md border-0 p-[15px] py-2.5 pt-[10px] outline-none [appearance:textfield] read-only:bg-gray-100 focus:ring-4 focus:ring-primary focus:ring-offset-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Barcode scannen..."
              value={barCode}
              onChange={(event) => setBarCode(event.target.value)}
            />
          </form>
        </div>
      </div>

      <p>Zuletzt gefunden:</p>
      {loading || (isUpdating && <Loading />)}
      {error && <div>Spiel nicht gefunden.</div>}
      {lastScannedGame && (
        <div className="mt-9 flex flex-col items-center justify-center md:ml-9">
          <h1 className="mb-6 text-xl font-bold md:text-2xl">
            {lastScannedGame.name}
          </h1>
          <div className="relative w-80 flex-shrink-0 overflow-hidden truncate rounded-l-md md:w-[500px]">
            <Image
              src={
                lastScannedGame.img_url
                  ? lastScannedGame.img_url
                  : '/noImage.jpg'
              }
              alt={lastScannedGame.name}
              width={900}
              height={900}
            />
            <div className="text-md z-1 absolute bottom-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg">
              {lastScannedGame.available}
            </div>
          </div>
          {operation === 'inconclusive' && (
            <div className="mt-6 flex gap-4">
              <GameUpdateButton
                game={lastScannedGame}
                operation={'borrow'}
                buttonType="scan"
                text="ausgeliehen"
                onSuccess={handleInconclusiveUpdate}
              />
              <GameUpdateButton
                game={lastScannedGame}
                operation={'return'}
                buttonType="scan"
                text="zurück gebracht"
                onSuccess={handleInconclusiveUpdate}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Scan;
