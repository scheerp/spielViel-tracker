'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NotificationProvider } from '@context/NotificationContext';
import { GamesProvider } from '@context/GamesContext';

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <NotificationProvider>
        <GamesProvider>{children}</GamesProvider>
      </NotificationProvider>
    </SessionProvider>
  );
};

export default AppProviders;
