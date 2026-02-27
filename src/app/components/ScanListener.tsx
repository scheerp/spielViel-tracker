'use client';

import { useEffect } from 'react';
import { useBarcodeScanner } from '@context/BarcodeScannerContext';
import { getOperation } from '@lib/utils';
import useUpdateGame from '@hooks/useUpdateGame';
import { useSession } from 'next-auth/react';

const ScanListener = () => {
  const { setOnScan } = useBarcodeScanner();
  const { updateGame } = useUpdateGame();
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    const handleScan = async (barcode: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/game/by_ean/${barcode}`,
      );

      const game = await response.json();

      const operation = getOperation(game);

      if (operation === 'inconclusive') {
        window.dispatchEvent(
          new CustomEvent('scan:inconclusive', { detail: game }),
        );
        return;
      }

      await updateGame({
        game,
        operation,
      });
    };

    setOnScan(() => handleScan);
  }, []);

  return null;
};

export default ScanListener;