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
    <div className="flex h-screen flex-col items-center overflow-hidden px-16 py-8">
      <RotatedTitle
        text="Partiesuche"
        tailwindBgColor="bg-tertiary"
        className="mb-16"
      />
      <span className="mb-14 text-xl font-semibold">
        Hier findest du Leute, die bereits nach Mitspieler*innen suchen
      </span>
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
