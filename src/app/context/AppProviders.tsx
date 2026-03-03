'use client';

import React, { ReactNode, Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NotificationProvider } from '@context/NotificationContext';
import { GamesProvider } from '@context/GamesContext';
import { FilterProvider } from './FilterContext';
import { ModalProvider } from './ModalContext';
import { FeedbackProvider } from './FeedbackContext';
import { PlayerSearchProvider } from './PlayerSearchContext';
import { BarcodeScannerProvider } from './BarcodeScannerContext';
import ScanActionModal from '@components/ScanActionModal';
import ScanListener from '@components/ScanListener';
import DevTimeDebugOverlay from '@components/DevTimeDebugOverlay';

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <NotificationProvider>
        <FilterProvider>
          <FeedbackProvider>
            <PlayerSearchProvider>
              <GamesProvider>
                <ModalProvider>
                  <BarcodeScannerProvider>
                    <ScanListener />
                    <ScanActionModal />
                    <Suspense fallback={null}>
                      <DevTimeDebugOverlay />
                    </Suspense>
                    {children}
                  </BarcodeScannerProvider>
                </ModalProvider>
              </GamesProvider>
            </PlayerSearchProvider>
          </FeedbackProvider>
        </FilterProvider>
      </NotificationProvider>
    </SessionProvider>
  );
};

export default AppProviders;
