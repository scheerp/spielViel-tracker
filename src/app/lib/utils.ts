import { Game, PlayerSearch } from '@context/GamesContext';
import { AppError, BarcodeConflictError } from '../types/ApiError';

export type OperationType = 'borrow' | 'return' | 'inconclusive';

type FilterGamesType = {
  games: Game[];
  filterText: string;
  showAvailableOnly: boolean;
  minPlayerCount: number;
};

const EVENT_START = new Date('2025-03-28'); // Event startet am 28. März 2025 (Freitag)
const EVENT_END = new Date('2025-03-30'); // Event endet am 30. März 2025 (Sonntag)

const EVENT_TIMES: Record<number, [number, number]> = {
  5: [18, 24], // Freitag: 18 - 24 Uhr
  6: [14, 24], // Samstag: 14 - 24 Uhr
  0: [11, 17], // Sonntag: 11 - 17 Uhr
};

const now = new Date();
const currentDay = now.getDay();
const currentHour = now.getHours();

export const isWithinEvent = ({
  considerTime = true,
}: {
  considerTime?: boolean;
} = {}): boolean => {
  if (now < EVENT_START || now > EVENT_END) {
    return false;
  }

  if (!considerTime) {
    return (
      currentDay >= EVENT_START.getDay() && currentDay <= EVENT_END.getDay()
    );
  }

  if (EVENT_TIMES[currentDay]) {
    const [start, end] = EVENT_TIMES[currentDay];
    return currentHour >= start && currentHour < end;
  }

  return false;
};

export const isWithinExtendedEvent = ({
  bufferDaysBefore = 0,
  bufferDaysAfter = 0,
}: {
  bufferDaysBefore?: number;
  bufferDaysAfter?: number;
}): boolean => {
  const extendedStart = new Date(EVENT_START);
  extendedStart.setDate(EVENT_START.getDate() - bufferDaysBefore);

  const extendedEnd = new Date(EVENT_END);
  extendedEnd.setDate(EVENT_END.getDate() + bufferDaysAfter);

  return now >= extendedStart && now <= extendedEnd;
};

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

// TODO: This is a temporary solution to handle the sessions
export const convertDayToDate = (day: string): string => {
  const daysMap: Record<string, string> = {
    Fr: '2025-03-28',
    Sa: '2025-03-29',
    So: '2025-03-30',
  };
  return daysMap[day] || '';
};

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
