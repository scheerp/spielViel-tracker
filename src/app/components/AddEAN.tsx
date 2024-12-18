'use client';

import { useState, useEffect, useRef } from 'react';
import { Game } from '../page';
import Loading from './Loading';
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';
import { isBarcodeConflictError } from '@lib/utils';

type AddEANProps = {
  game: Game;
};

type BarcodeConflictError = {
  error_code: 'BARCODE_CONFLICT';
  existing_game: {
    ean: number;
    id: number;
    name: string;
  };
  message: string;
};

const AddEAN: React.FC<AddEANProps> = ({ game }) => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [barCode, setBarCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<BarcodeConflictError | string | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddEAN = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/add_ean/${game.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ ean: Number(barCode) }),
        },
      );

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      showNotification({
        message: (
          <div className="flex items-center">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
              <Image
                src={game.thumbnail_url ? game.thumbnail_url : '/noImage.jpg'}
                alt={game.name}
                priority
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                style={{
                  objectFit: "cover"
                }} />
            </div>
            <span className="ml-4">
              {game.name}
              {': barcode hinzugefügt'}
            </span>
          </div>
        ),
        type: 'success',
        duration: 3000,
      });
    } catch (err) {
      const error = err as AppError;

      if (isBarcodeConflictError(error)) {
        showNotification({
          message: (
            <div className="flex items-center">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
                <Image
                  src={error.detail.details.thumbnail_url || '/noImage.jpg'}
                  alt={error.detail.details.name || 'Unbekannt'}
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "cover"
                  }} />
              </div>
              <span className="ml-4">
                {`Barcode bereits vergeben an:\n${error.detail.details.name}`}
              </span>
            </div>
          ),
          type: 'error',
          duration: 3000,
        });
      } else {
        setError(
          error.detail.message || 'Ein unbekannter Fehler ist aufgetreten',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <div className="mb-8 flex flex-col items-center">
      <div className="z-[1] mt-8 flex w-full flex-col justify-around rounded-xl bg-white text-base shadow-md md:w-[50%]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAddEAN();
          }}
        >
          <input
            type="number"
            ref={inputRef}
            readOnly={loading}
            className="h-16 w-full rounded-xl border-0 p-[15px] py-2.5 pt-[10px] outline-none [appearance:textfield] read-only:bg-gray-100 focus:ring-4 focus:ring-primary focus:ring-offset-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Barcode scannen..."
            value={barCode}
            onChange={(event) => setBarCode(event.target.value)}
          />
        </form>
      </div>
    </div>
    {loading && <Loading />}
    {error &&
      typeof error === 'object' &&
      'error_code' in error &&
      error.error_code === 'BARCODE_CONFLICT' && (
        <div>{`${error.message} an: ${error.existing_game.name}`}</div>
      )}
    <p className="mt-2">Barcode Scannen für:</p>
    {game && (
      <div className="mt-9 flex flex-col items-center justify-center md:ml-9">
        <h1 className="mb-6 text-xl font-bold md:text-2xl">{game.name}</h1>
        <div className="relative w-80 flex-shrink-0 overflow-hidden truncate rounded-l-md md:w-[500px]">
          <Image
            src={game.img_url ? game.img_url : '/noImage.jpg'}
            alt={game.name}
            width={900}
            height={900}
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
          <div className="text-md z-1 absolute bottom-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg">
            {game.available}
          </div>
        </div>
      </div>
    )}
  </>);
};

export default AddEAN;
