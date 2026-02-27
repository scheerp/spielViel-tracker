'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

type BarcodeScannerContextType = {
  scanningEnabled: boolean;
  toggleScanning: () => void;
  setOnScan: (fn: (barcode: string) => void) => void;
};

const BarcodeScannerContext = createContext<BarcodeScannerContextType | null>(
  null,
);

const SCAN_SPEED_THRESHOLD = 40; // ms between keys
const MIN_BARCODE_LENGTH = 8;

export const BarcodeScannerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [scanningEnabled, setScanningEnabled] = useState(true);

  const bufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);
  const scanStartTimeRef = useRef(0);

  const onScanRef = useRef<(barcode: string) => void>(() => {});

  const toggleScanning = () => setScanningEnabled((v) => !v);

  const setOnScan = (fn: (barcode: string) => void) => {
    onScanRef.current = fn;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!scanningEnabled) return;

      const target = event.target as HTMLElement;

      // ignore inputs unless explicitly allowed
      if (
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable) &&
        !target.closest('[data-allow-scanner]')
      ) {
        return;
      }

      const now = Date.now();
      const delta = now - lastKeyTimeRef.current;

      lastKeyTimeRef.current = now;

      // reset buffer if typing is too slow
      if (delta > SCAN_SPEED_THRESHOLD) {
        bufferRef.current = '';
        scanStartTimeRef.current = now;
      }

      if (event.key === 'Enter') {
        const barcode = bufferRef.current;

        bufferRef.current = '';

        const duration = now - scanStartTimeRef.current;

        const avgKeySpeed = duration / barcode.length;

        const looksLikeScanner =
          barcode.length >= MIN_BARCODE_LENGTH &&
          avgKeySpeed < SCAN_SPEED_THRESHOLD;

        if (looksLikeScanner) {
          onScanRef.current(barcode);
        }

        return;
      }

      if (/^[0-9A-Za-z]$/.test(event.key)) {
        bufferRef.current += event.key;
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      if (!scanningEnabled) return;

      const pasted = event.clipboardData?.getData('text');

      if (!pasted) return;

      if (pasted.length >= MIN_BARCODE_LENGTH) {
        onScanRef.current(pasted.trim());
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('paste', handlePaste);
    };
  }, [scanningEnabled]);

  return (
    <BarcodeScannerContext.Provider
      value={{
        scanningEnabled,
        toggleScanning,
        setOnScan,
      }}
    >
      {children}
    </BarcodeScannerContext.Provider>
  );
};

export const useBarcodeScanner = () => {
  const ctx = useContext(BarcodeScannerContext);
  if (!ctx) throw new Error('useBarcodeScanner must be used in provider');
  return ctx;
};
