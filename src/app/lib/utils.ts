import { Game } from '../page';

type filterGamesType = {
  games: Game[];
  filterText: string;
  showAvailableOnly: boolean;
  playerCount: number[];
};

export const filterGames = ({
  games,
  filterText,
  showAvailableOnly,
  playerCount,
}: filterGamesType): Game[] => {
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
      return item.is_available;
    });
  }

  return filtered;
};
