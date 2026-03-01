import { Game } from '@context/GamesContext';
import { AppError, BarcodeConflictError } from '../types/ApiError';

/* ------------------------------------------------ */
/* Types */
/* ------------------------------------------------ */

export type OperationType = 'borrow' | 'return' | 'inconclusive';

type FilterGamesType = {
  games: Game[];
  filterText: string;
  showAvailableOnly: boolean;
  minPlayerCount: number;
};

/* ------------------------------------------------ */
/* Event Days */
/* ------------------------------------------------ */

/**
 * zentrale Definition der Eventtage
 * -> wird für Rendering, Gruppierung und Eventlogik genutzt
 */
export const DAY_KEYS = ['FRI', 'SAT', 'SUN', 'OTHER'] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  FRI: 'Freitag',
  SAT: 'Samstag',
  SUN: 'Sonntag',
  OTHER: 'Weitere Termine',
};

export const FORCE_BORROW_COUNT_UPDATE = false;

/**
 * Wörter mit denen Tage erkannt werden
 * -> leicht erweiterbar
 */
const DAY_MATCHERS: Record<Exclude<DayKey, 'OTHER'>, string[]> = {
  FRI: ['freitag', 'fr'],
  SAT: ['samstag', 'sa'],
  SUN: ['sonntag', 'so'],
};

/**
 * erkennt aus einem String den Eventtag
 */
export const getSessionDayKey = (time?: string): DayKey => {
  const t = time?.toLowerCase() ?? '';

  for (const [day, patterns] of Object.entries(DAY_MATCHERS)) {
    if (patterns.some((p) => t.includes(p))) {
      return day as DayKey;
    }
  }

  return 'OTHER';
};

/* ------------------------------------------------ */
/* Event Date Handling */
/* ------------------------------------------------ */

export const EVENT_START = new Date('2026-03-13');
export const EVENT_END = new Date('2026-03-15');

const EVENT_TIMES: Partial<Record<DayKey, [number, number]>> = {
  FRI: [18, 24],
  SAT: [14, 24],
  SUN: [11, 17],
};

/**
 * JS weekday → Event day
 */
const WEEKDAY_TO_DAYKEY: Partial<Record<number, DayKey>> = {
  5: 'FRI',
  6: 'SAT',
  0: 'SUN',
};

const now = new Date();
const currentHour = now.getHours();
const todayKey = WEEKDAY_TO_DAYKEY[now.getDay()];

/**
 * prüft ob wir aktuell während des Events sind
 */
export const isWithinEvent = ({
  considerTime = true,
}: {
  considerTime?: boolean;
} = {}): boolean => {
  if (now < EVENT_START || now > EVENT_END) {
    return false;
  }

  if (!considerTime) return true;

  if (todayKey && EVENT_TIMES[todayKey]) {
    const [start, end] = EVENT_TIMES[todayKey];
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

/* ------------------------------------------------ */
/* Time Utilities */
/* ------------------------------------------------ */

/**
 * wandelt "18:30" oder "18.30" in Minuten um
 * -> nützlich zum Sortieren
 */
export const parseTimeToMinutes = (time?: string): number => {
  const match = time?.match(/(\d{1,2})[:.](\d{2})/);

  if (!match) return Number.MAX_SAFE_INTEGER;

  return parseInt(match[1]) * 60 + parseInt(match[2]);
};

export const timeSinceMinutes = (timestamp: string): string => {
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'gerade eben';

  return `seit ${diffMinutes} Minuten`;
};

/* ------------------------------------------------ */
/* Game Filtering */
/* ------------------------------------------------ */

export const filterGames = ({
  games,
  filterText,
  showAvailableOnly,
  minPlayerCount,
}: FilterGamesType): Game[] => {
  let filtered = games.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  filtered = filtered.filter((item) => item.max_players >= minPlayerCount);

  if (showAvailableOnly) {
    filtered = filtered.filter((item) => item.available);
  }

  return filtered;
};

export const getOperation = (game: Game): OperationType => {
  if (game.available === 0) return 'return';
  if (game.available === game.quantity) return 'borrow';
  return 'inconclusive';
};

/* ------------------------------------------------ */
/* API Errors */
/* ------------------------------------------------ */

export const isBarcodeConflictError = (
  error: AppError,
): error is BarcodeConflictError => {
  return (
    error.detail?.error_code === 'BARCODE_CONFLICT' && 'details' in error.detail
  );
};

/* ------------------------------------------------ */
/* Game Metadata */
/* ------------------------------------------------ */

export const ComplexityMapping = {
  Family: {
    label: 'Familie',
    color: 'bg-status',
  },
  Beginner: {
    label: 'Einsteiger',
    color: 'bg-secondary',
  },
  Intermediate: {
    label: 'Erfahren',
    color: 'bg-quinary',
  },
  Advanced: {
    label: 'Kenner',
    color: 'bg-error',
  },
  Expert: {
    label: 'Experte',
    color: 'bg-tertiary',
  },
};

export const FamiliarityMapping = {
  UNSET: {
    label: 'k. Angabe',
    color: 'bg-background',
    border: 'border-background',
    value: 0,
  },
  UNKNOWN: {
    label: 'Unbekannt',
    color: 'bg-error',
    border: 'border-error',
    value: 1,
  },
  NEULING: {
    label: 'Neuling',
    color: 'bg-quinary',
    border: 'border-quinary',
    value: 2,
  },
  PROFI: {
    label: 'Profi',
    color: 'bg-quaternary',
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
  {} as Record<
    number,
    (typeof FamiliarityMapping)[keyof typeof FamiliarityMapping]
  >,
);

/* ------------------------------------------------ */
/* Event Types */
/* ------------------------------------------------ */

export const EVENT_TYPE_LABELS: Record<string, string> = {
  turnier: 'Turnier',
  spielesession: 'Spielesession',
  penandpaper: 'Pen & Paper',
};
