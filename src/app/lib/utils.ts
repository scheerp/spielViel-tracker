import { Game, PlayerSearch } from '@context/GamesContext';
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

const now = new Date();

export const timeSinceMinutes = (timestamp: string): string => {
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'gerade eben';
  }
  return `seit ${diffMinutes} Minuten`;
};

export const categorizePlayerSearches = (playerSearches: PlayerSearch[]) => {
  const valid = playerSearches.filter(
    (playerSearch) => new Date(playerSearch.expires_at) > now,
  );
  const expired = playerSearches.filter(
    (playerSearch) => new Date(playerSearch.expires_at) <= now,
  );

  valid.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  expired.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return { valid, expired };
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
  UNSET: {
    label: 'k. Angabe',
    color: 'bg-background text-gray-500',
    border: 'border-background',
    value: 0,
  },
  UNKNOWN: {
    label: 'Unbekannt',
    color: 'bg-error text-white',
    border: 'border-error',
    value: 1,
  },
  NEULING: {
    label: 'Neuling',
    color: 'bg-quinary text-black',
    border: 'border-quinary',
    value: 2,
  },
  PROFI: {
    label: 'Profi',
    color: 'bg-quaternary text-white',
    border: 'border-quaternary',
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
