import { Game } from '../page';

type filterGamesType = {
  games: Game[];
  filterText: string;
  showAvailableOnly: boolean;
  minPlayerCount: number;
};

export const filterGames = ({
  games,
  filterText,
  showAvailableOnly,
  minPlayerCount,
}: filterGamesType): Game[] => {
  let filtered = games.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  filtered = filtered.filter((item) => {
    return item.max_players >= minPlayerCount;
  });

  if (showAvailableOnly) {
    filtered = filtered.filter((item) => {
      return item.is_available;
    });
  }

  return filtered;
};

export const sortGames = (games: Game[], sortOption: string): Game[] => {
  const sortedPosts = [...games];
  switch (sortOption) {
    case 'alphaAsc':
      sortedPosts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'alphaDesc':
      sortedPosts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      sortedPosts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return sortedPosts;
};
