import { Game } from '../page';
import { AppError, BarcodeConflictError } from '../types/ApiError';

type FilterGamesType = {
  games: Game[];
  filterText: string;
  showAvailableOnly: boolean;
  minPlayerCount: number;
};

export type OperationType = 'borrow' | 'return' | 'inconclusive';

export const filterGames = ({
  games,
  filterText,
  showAvailableOnly,
  minPlayerCount,
}: FilterGamesType): Game[] => {
  let filtered = games.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  filtered = filtered.filter((item) => {
    return item.max_players >= minPlayerCount;
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

export const isBarcodeConflictError = (
  error: AppError,
): error is BarcodeConflictError => {
  console.log(error);

  return (
    error.detail.error_code === 'BARCODE_CONFLICT' &&
    error.detail !== undefined &&
    'details' in error.detail
  );
};
