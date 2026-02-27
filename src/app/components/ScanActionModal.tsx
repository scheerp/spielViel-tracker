'use client';

import { useEffect, useState } from 'react';
import { Game } from '@context/GamesContext';
import FloatingUpdateButtons from './FloatingUpdateButtons';

const ScanActionModal = () => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const handler = (event: CustomEvent<Game>) => {
      setGame(event.detail);
    };

    window.addEventListener('scan:inconclusive', handler as EventListener);

    return () => {
      window.removeEventListener('scan:inconclusive', handler as EventListener);
    };
  }, []);

  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="rounded-xl bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">{game.name}</h2>

        <FloatingUpdateButtons
          game={game}
          handleSuccess={() => setGame(null)}
        />
      </div>
    </div>
  );
};

export default ScanActionModal;