'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NotificationProvider } from '@context/NotificationContext';
import { GamesProvider } from '@context/GamesContext';
import { FilterProvider } from './FilterContext';
import { ModalProvider } from './ModalContext';
import { FeedbackProvider } from './FeedbackContext';

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <NotificationProvider>
        <FilterProvider>
          <GamesProvider>
            <FeedbackProvider>
              <ModalProvider>{children}</ModalProvider>
            </FeedbackProvider>
          </GamesProvider>
        </FilterProvider>
      </NotificationProvider>
    </SessionProvider>
  );
};

export default AppProviders;
