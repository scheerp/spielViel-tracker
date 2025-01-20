'use client';

import { useSession } from 'next-auth/react';
import GameUpdateButton from './GameUpdateButton';
import { Game } from '@context/GamesContext';

type ListUpdateButtonsProps = {
  game: Game;
};

const ListUpdateButtons = ({ game }: ListUpdateButtonsProps) => {
  const { data: session } = useSession();

  return session ? (
    <div className="flex gap-2 md:flex-col">
      <GameUpdateButton game={game} operation={'borrow'} buttonType="list" />
      <GameUpdateButton game={game} operation={'return'} buttonType="list" />
    </div>
  ) : null;
};

export default ListUpdateButtons;
