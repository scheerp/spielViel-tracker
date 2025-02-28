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

export const ComplexityMapping = {
  Family: {
    label: 'Familie',
    color: 'bg-status text-white',
  },
  Beginner: {
    label: 'Einsteiger',
    color: 'bg-secondary text-white',
  },
  Intermediate: {
    label: 'Erfahren',
    color: 'bg-quinary text-black',
  },
  Advanced: {
    label: 'Kenner',
    color: 'bg-error text-white',
  },
  Expert: {
    label: 'Experte',
    color: 'bg-tertiary text-white',
  },
};

export const FamiliarityMapping = {
  UNKNOWN: {
    label: 'Unbekannt',
    color: 'bg-status text-white',
    border: 'border-status',
    value: 0,
  },
  NEULING: {
    label: 'Neuling',
    color: 'bg-secondary text-white',
    border: 'border-secondary',
    value: 1,
  },
  KENNER: {
    label: 'Kenner',
    color: 'bg-error text-white',
    border: 'border-error',
    value: 2,
  },
  GURU: {
    label: 'Guru',
    color: 'bg-tertiary text-white',
    border: 'border-tertiary',
    value: 3,
  },
};

export type ComplexityType = keyof typeof ComplexityMapping;
export type FamiliarityType = keyof typeof FamiliarityMapping;

export const FamiliarityValueMapping = Object.values(FamiliarityMapping).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as {
    [key: number]: {
      label: string;
      color: string;
      border: string;
      value: number;
    };
  },
);
