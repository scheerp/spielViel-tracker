'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

type BarcodeScannerContextType = {
  scanningEnabled: boolean;
  toggleScanning: () => void;
  onScan: (barcode: string) => void;
  setOnScan: (fn: (barcode: string) => void) => void;
};

const BarcodeScannerContext = createContext<BarcodeScannerContextType | null>(
  null,
);

export const BarcodeScannerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [onScan, setOnScan] = useState<(barcode: string) => void>(() => {});

  const buffer = useRef('');
  const lastKeyTime = useRef(0);

  const toggleScanning = () => setScanningEnabled((v) => !v);

  useEffect(() => {
    if (!scanningEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {

    if (/^[0-9]$/.test(event.key) || event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
    }
      const now = Date.now();

      if (now - lastKeyTime.current > 50) {
        buffer.current = '';
      }

      lastKeyTime.current = now;

      if (event.key === 'Enter') {
        if (buffer.current.length > 3) {
          onScan(buffer.current);
        }
        buffer.current = '';
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        buffer.current += event.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [scanningEnabled, onScan]);

  return (
    <BarcodeScannerContext.Provider
      value={{
        scanningEnabled,
        toggleScanning,
        onScan,
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