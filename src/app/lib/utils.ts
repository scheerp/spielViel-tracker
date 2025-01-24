import { Game } from '@context/GamesContext';
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
  if (game.available === game.quantity) return 'borrow';
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

export const getComplexity = (
  complexity: number,
): null | { complexity: string; color: string } => {
  if (complexity === 0) return null;
  if (complexity <= 2)
    return {
      complexity: 'Einsteiger',
      color: 'bg-status text-white',
    };
  if (complexity <= 3)
    return {
      complexity: 'Fortgeschritten',
      color: 'bg-secondary text-white ',
    };
  if (complexity <= 4)
    return {
      complexity: 'Kenner',
      color: 'bg-quinary text-black',
    };
  return {
    complexity: 'Experte',
    color: 'bg-error text-white',
  };
};
