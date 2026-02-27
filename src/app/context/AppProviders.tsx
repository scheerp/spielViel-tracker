'use client';

import React, { ReactNode } from 'react';
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

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {


  return (
    <SessionProvider>
      <NotificationProvider>
        <FilterProvider>
          <GamesProvider>
            <BarcodeScannerProvider>
              <ModalProvider>
                <PlayerSearchProvider>
                  <FeedbackProvider>
                    <ScanListener />
                    <ScanActionModal />
                    {children}
                  </FeedbackProvider>
                </PlayerSearchProvider>
              </ModalProvider>
            </BarcodeScannerProvider>
          </GamesProvider>
        </FilterProvider>
      </NotificationProvider>
    </SessionProvider>
  );
};

export default AppProviders;
