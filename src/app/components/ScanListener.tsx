'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useBarcodeScanner } from '@context/BarcodeScannerContext';
import useUpdateGame from '@hooks/useUpdateGame';
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';

const ScanListener = () => {
  const { data: session, status } = useSession();
  const { setOnScan } = useBarcodeScanner();
  const { updateGame } = useUpdateGame();
  const { showNotification } = useNotification();

  const scanQueue = useRef<string[]>([]);
  const processing = useRef(false);

  // ✅ Scan-Handler
  const handleScan = useCallback(
    async (barcode: string) => {
      if (!session?.accessToken) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games/game/scan_by_ean/${barcode}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          },
        );

        if (!res.ok) {
          const err = await res.json();
          throw err;
        }

        const game = await res.json();

        if (game.action === 'inconclusive') {
          window.dispatchEvent(
            new CustomEvent('scan:inconclusive', { detail: game }),
          );
        } else {
          await updateGame({
            game,
            operation: game.action,
            skipRequest: true, // ✅ verhindert doppelten Request
          });
        }
      } catch (err) {
        console.error('Scan Error:', err);
        const error = err as AppError;
        showNotification({
          message: `Fehler: ${error.detail?.message || 'Unbekannter Fehler'}`,
          type: 'error',
          duration: 3000,
        });
      }
    },
    [session?.accessToken, updateGame, showNotification],
  );

  // ✅ Queue-Processor
  const processQueue = useCallback(async () => {
    if (processing.current || scanQueue.current.length === 0) return;
    processing.current = true;

    const barcode = scanQueue.current.shift()!;
    await handleScan(barcode);

    processing.current = false;
    processQueue(); // nächste Scan im Queue
  }, [handleScan]);

  useEffect(() => {
    if (!session || status !== 'authenticated') return;

    const scannerHandler = (barcode: string) => {
      scanQueue.current.push(barcode);
      processQueue();
    };

    setOnScan(scannerHandler);
  }, [session, status, setOnScan, processQueue]);

  return null;
};

export default ScanListener;
