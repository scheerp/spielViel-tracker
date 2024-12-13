import { Game } from '../page';

type FilterGamesType = {
  games: Game[];
  filterText: string;
  showAvailableOnly: boolean;
  playerCount: number[];
};

export type OperationType = 'borrow' | 'return' | 'inconclusive';

export const filterGames = ({
  games,
  filterText,
  showAvailableOnly,
  playerCount,
}: FilterGamesType): Game[] => {
  let filtered = games.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  filtered = filtered.filter((item) => {
    const { min_players, max_players } = item;

    return (
      (min_players >= playerCount[0] && min_players <= playerCount[1]) ||
      (max_players >= playerCount[0] && max_players <= playerCount[1]) ||
      (min_players <= playerCount[0] && max_players >= playerCount[1])
    );
  });

  if (showAvailableOnly) {
    filtered = filtered.filter((item) => {
      return item.available;
    });
  }

  return filtered;
};

export const getOperation = (game: Game): OperationType => {
  if (game.available === 0) return 'return';
  if (game.available === game.total_copies) return 'borrow';
  return 'inconclusive';
};
