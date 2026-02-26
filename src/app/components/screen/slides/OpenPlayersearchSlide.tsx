'use client';

import RotatedTitle from '@components/RotatedTitle';
import { FlatPlayerSearchWithGame } from '@context/PlayerSearchContext';
import { useState } from 'react';
import OpenplayerSearchCard from '@components/OpenplayerSearchCard';

const OpenPlayersearchSlide = ({
  data,
}: {
  data: FlatPlayerSearchWithGame[];
}) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  return (
    <div className="container mx-auto mb-16 flex flex-col items-center p-6">
      <RotatedTitle
        text="Partiesuche"
        tailwindBgColor="bg-tertiary"
        className="mb-12 mt-12"
      />
      <p className="mb-4 text-sm font-medium text-gray-500 md:mx-8">
        Hier findest du Leute, die bereits nach Mitspieler*innen suchen
      </p>
      {data.map((search: FlatPlayerSearchWithGame, index: number) => {
        return (
          <OpenplayerSearchCard
            key={search.game.id + '-' + search.player_search.id}
            search={search}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            index={index}
          />
        );
      })}
    </div>
  );
};
export default OpenPlayersearchSlide;
