import { Game } from "../games/page";

export const filterGames = (
  games: Game[],
  filterText: string,
  showAvailable: boolean
): Game[] => {
  let filtered = games.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (showAvailable) {
    filtered = filtered.filter((item) => {
      return item.is_available;
    });
  }

  return filtered;
};

export const sortGames = (games: Game[], sortOption: string): Game[] => {
  const sortedPosts = [...games];
  switch (sortOption) {
    case "alphaAsc":
      sortedPosts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "alphaDesc":
      sortedPosts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      sortedPosts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return sortedPosts;
};
