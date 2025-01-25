'use client';

import { useState, useEffect, useRef } from 'react';
import Loading from './Loading';
import Image from 'next/image';
import { Game } from '@context/GamesContext';
import useUpdateGame from '@hooks/useUpdateGame';

type AddEANProps = {
  game: Game;
};

const AddEAN: React.FC<AddEANProps> = ({ game }) => {
  const [barCode, setBarCode] = useState<string>('');
  const { updateGame, isLoading } = useUpdateGame();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddEAN = async () => {
    if (!barCode) return;

    await updateGame({
      game,
      operation: 'addEAN',
      ean: Number(barCode),
    });

    setBarCode('');
  };

  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="z-[1] mt-12 flex w-full flex-col justify-around rounded-xl bg-white text-base shadow-md md:w-[50%]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAddEAN();
          }}
        >
          <input
            type="number"
            ref={inputRef}
            readOnly={isLoading}
            className="h-16 w-full rounded-xl border-0 p-[15px] py-2.5 pt-[10px] outline-none [appearance:textfield] read-only:bg-gray-100 focus:ring-4 focus:ring-primary focus:ring-offset-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Barcode scannen..."
            value={barCode}
            onChange={(event) => setBarCode(event.target.value)}
          />
        </form>
      </div>
      <p className="mt-2">Barcode Scannen für:</p>
      {game && (
        <div className="mt-9 flex flex-col items-center justify-center md:ml-9">
          <h1 className="mb-6 text-xl font-bold md:text-2xl">{game.name}</h1>
          <div className="relative w-80 flex-shrink-0 overflow-hidden truncate rounded-l-md md:w-[500px]">
            <div className={`relative ${isLoading ? 'opacity-70' : ''}`}>
              <Image
                src={game.img_url ? game.img_url : '/noImage.jpg'}
                alt={game.name}
                width={900}
                height={900}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loading />
              </div>
            )}
            <div className="text-md z-1 absolute bottom-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg">
              {game.available}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEAN;
