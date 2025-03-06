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
  UNSET: {
    label: 'k. Angabe',
    color: 'bg-error text-white',
    border: 'border-error',
    value: 0,
  },
  UNKNOWN: {
    label: 'Unbekannt',
    color: 'bg-status text-white',
    border: 'border-status',
    value: 1,
  },
  NEULING: {
    label: 'Neuling',
    color: 'bg-secondary text-white',
    border: 'border-secondary',
    value: 2,
  },
  KENNER: {
    label: 'Profi',
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

// image Magnifier utils

export const invertNumber = (min, max, num) => {
  return max + min - num;
};

export const convertRange = (oldMin, oldMax, newMin, newMax, oldValue) => {
  const percent = (oldValue - oldMin) / (oldMax - oldMin);
  const result = percent * (newMax - newMin) + newMin;
  return result || 0;
};

export const convertWidthToPx = (width, containerWidth) => {
  if (typeof width === 'number') {
    return width;
  }
  if (typeof width !== 'string') {
    throw new Error(`Received: ${width} - Size must be a number or string`);
  }
  if (width.substr(-1) === '%') {
    const percent = 100 / Number(width.slice(0, -1));
    return containerWidth / percent;
  }
  if (width.substr(-2) === 'px') {
    return Number(width.slice(0, -2));
  }
  return Number(width);
};

export const convertWidthToString = (width) => {
  if (typeof width === 'number') {
    return width + 'px';
  }
  return width;
};
