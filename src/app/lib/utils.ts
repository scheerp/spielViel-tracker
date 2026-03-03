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

export const DAY_ORDER_INDEX: Record<DayKey, number> = {
  FRI: 0,
  SAT: 1,
  SUN: 2,
  OTHER: 3,
};

export const EVENT_DAY_SEQUENCE: DayKey[] = ['FRI', 'SAT', 'SUN'];

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
export const WEEKDAY_TO_DAYKEY: Partial<Record<number, DayKey>> = {
  5: 'FRI',
  6: 'SAT',
  0: 'SUN',
};

const EVENT_DAY_NUMBER_TO_KEY: Record<number, DayKey> = {
  0: 'FRI',
  1: 'SAT',
  2: 'SUN',
};

const parseDevEventDayNumber = (
  params?: URLSearchParams,
): number | undefined => {
  if (!params) return undefined;

  const eventDayRaw = params.get('devEventDay');
  if (eventDayRaw === null || eventDayRaw.trim() === '') {
    return undefined;
  }

  const eventDayNumber = Number(eventDayRaw);

  if (!Number.isInteger(eventDayNumber)) {
    return undefined;
  }

  return eventDayNumber;
};

const getDevSearchParams = (
  searchParams?: URLSearchParams | string,
  allowDevOverrides = false,
): URLSearchParams | undefined => {
  if (!allowDevOverrides) return undefined;

  if (searchParams instanceof URLSearchParams) return searchParams;
  if (typeof searchParams === 'string') {
    const normalized = searchParams.startsWith('?')
      ? searchParams.slice(1)
      : searchParams;
    return new URLSearchParams(normalized);
  }

  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }

  return undefined;
};

const parseDevEventDayKey = (params?: URLSearchParams): DayKey | undefined => {
  if (!params) return undefined;

  const eventDayNumber = parseDevEventDayNumber(params);
  if (eventDayNumber && EVENT_DAY_NUMBER_TO_KEY[eventDayNumber]) {
    return EVENT_DAY_NUMBER_TO_KEY[eventDayNumber];
  }

  const dayRaw = (params.get('devDay') ?? '').toUpperCase();
  if (DAY_KEYS.includes(dayRaw as DayKey)) {
    return dayRaw as DayKey;
  }

  return undefined;
};

const parseDevMinutes = (params?: URLSearchParams): number | undefined => {
  if (!params) return undefined;

  const minutes = parseTimeToMinutes(params.get('devTime') ?? '');
  return minutes === Number.MAX_SAFE_INTEGER ? undefined : minutes;
};

export const getCurrentEventReference = ({
  now = new Date(),
  searchParams,
  allowDevOverrides = false,
}: {
  now?: Date;
  searchParams?: URLSearchParams | string;
  allowDevOverrides?: boolean;
} = {}) => {
  const params = getDevSearchParams(searchParams, allowDevOverrides);
  const overrideEventDayNumber = parseDevEventDayNumber(params);
  const overrideDayKey = parseDevEventDayKey(params);
  const overrideMinutes = parseDevMinutes(params);

  const simulatedDate =
    overrideEventDayNumber !== undefined
      ? (() => {
          const date = new Date(EVENT_START);
          date.setDate(EVENT_START.getDate() + overrideEventDayNumber);
          return date;
        })()
      : undefined;

  const dayKeyFromEventDayNumber =
    overrideEventDayNumber !== undefined
      ? (EVENT_DAY_NUMBER_TO_KEY[overrideEventDayNumber] ?? 'OTHER')
      : undefined;

  const dayKey =
    dayKeyFromEventDayNumber ??
    overrideDayKey ??
    WEEKDAY_TO_DAYKEY[now.getDay()] ??
    'OTHER';
  const minutes = overrideMinutes ?? now.getHours() * 60 + now.getMinutes();

  return {
    dayKey,
    minutes,
    hasDayOverride:
      overrideDayKey !== undefined || overrideEventDayNumber !== undefined,
    hasTimeOverride: overrideMinutes !== undefined,
    overrideEventDayNumber,
    simulatedDate,
  };
};

export type EventPhase =
  | 'before-event'
  | 'during-event'
  | 'after-event'
  | 'before-day-window'
  | 'after-day-window'
  | 'outside-event-day';

export const getEventPhase = ({
  now = new Date(),
  searchParams,
  allowDevOverrides = false,
}: {
  now?: Date;
  searchParams?: URLSearchParams | string;
  allowDevOverrides?: boolean;
} = {}): EventPhase => {
  const { dayKey, minutes, hasDayOverride, overrideEventDayNumber } =
    getCurrentEventReference({
      now,
      searchParams,
      allowDevOverrides,
    });

  if (overrideEventDayNumber !== undefined) {
    if (overrideEventDayNumber < 0) {
      return 'before-event';
    }

    if (overrideEventDayNumber > 2) {
      return 'after-event';
    }
  }

  if (!hasDayOverride && now < EVENT_START) {
    return 'before-event';
  }

  if (!hasDayOverride && now > EVENT_END) {
    return 'after-event';
  }

  const eventTime = EVENT_TIMES[dayKey];
  if (!eventTime) {
    return 'outside-event-day';
  }

  const [start, end] = eventTime;
  const startMinutes = start * 60;
  const endMinutes = end * 60;

  if (minutes < startMinutes) {
    return 'before-day-window';
  }

  if (minutes >= endMinutes) {
    return 'after-day-window';
  }

  return 'during-event';
};

/**
 * prüft ob wir aktuell während des Events sind
 */
export const isWithinEvent = ({
  considerTime = true,
  searchParams,
  allowDevOverrides = false,
}: {
  considerTime?: boolean;
  searchParams?: URLSearchParams | string;
  allowDevOverrides?: boolean;
} = {}): boolean => {
  const now = new Date();
  const phase = getEventPhase({ now, searchParams, allowDevOverrides });
  const { hasDayOverride } = getCurrentEventReference({
    now,
    searchParams,
    allowDevOverrides,
  });

  if (!considerTime) {
    if (hasDayOverride) return true;
    return now >= EVENT_START && now <= EVENT_END;
  }

  return phase === 'during-event';
};

export const isWithinExtendedEvent = ({
  bufferDaysBefore = 0,
  bufferDaysAfter = 0,
  searchParams,
  allowDevOverrides = false,
}: {
  bufferDaysBefore?: number;
  bufferDaysAfter?: number;
  searchParams?: URLSearchParams | string;
  allowDevOverrides?: boolean;
}): boolean => {
  const now = new Date();
  const { simulatedDate } = getCurrentEventReference({
    now,
    searchParams,
    allowDevOverrides,
  });
  const effectiveDate = simulatedDate ?? now;

  const extendedStart = new Date(EVENT_START);
  extendedStart.setDate(EVENT_START.getDate() - bufferDaysBefore);

  const extendedEnd = new Date(EVENT_END);
  extendedEnd.setDate(EVENT_END.getDate() + bufferDaysAfter);

  return effectiveDate >= extendedStart && effectiveDate <= extendedEnd;
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

export const isAllDaySession = (time?: string): boolean =>
  /ganzt(?:ä|a)gig/i.test(time ?? '');

type SessionLike = {
  content: {
    time?: string;
  };
};

export const getUpcomingSessionsForCurrentDay = <T extends SessionLike>(
  sessions: T[],
  {
    limit = 4,
    now = new Date(),
    searchParams,
    allowDevOverrides = false,
  }: {
    limit?: number;
    now?: Date;
    searchParams?: URLSearchParams | string;
    allowDevOverrides?: boolean;
  } = {},
): T[] => {
  const { dayKey: referenceDay, minutes: referenceMinutes } =
    getCurrentEventReference({ now, searchParams, allowDevOverrides });

  return sessions
    .map((session, index) => {
      const dayKey = getSessionDayKey(session.content.time);
      const timeMinutes = parseTimeToMinutes(session.content.time);

      return {
        session,
        index,
        dayKey,
        timeMinutes,
      };
    })
    .filter(({ session, dayKey, timeMinutes }) => {
      if (isAllDaySession(session.content.time)) return false;
      if (dayKey !== referenceDay) return false;
      if (timeMinutes === Number.MAX_SAFE_INTEGER) return false;
      return timeMinutes >= referenceMinutes;
    })
    .sort((a, b) => {
      if (a.timeMinutes !== b.timeMinutes) return a.timeMinutes - b.timeMinutes;
      return a.index - b.index;
    })
    .slice(0, limit)
    .map((item) => item.session);
};

export const groupSessionsByDay = <T extends SessionLike>(
  sessions: T[],
  {
    allDayFirst = true,
  }: {
    allDayFirst?: boolean;
  } = {},
): Record<DayKey, T[]> => {
  const grouped: Record<DayKey, Array<{ session: T; sourceIndex: number }>> = {
    FRI: [],
    SAT: [],
    SUN: [],
    OTHER: [],
  };

  sessions.forEach((session, sourceIndex) => {
    const dayKey = getSessionDayKey(session.content.time);

    grouped[dayKey].push({
      session,
      sourceIndex,
    });
  });

  const sortedByDay = Object.fromEntries(
    DAY_KEYS.map((dayKey) => {
      const sorted = grouped[dayKey]
        .slice()
        .sort((a, b) => {
          if (allDayFirst) {
            const aIsAllDay = isAllDaySession(a.session.content.time);
            const bIsAllDay = isAllDaySession(b.session.content.time);

            if (aIsAllDay !== bIsAllDay) {
              return aIsAllDay ? -1 : 1;
            }
          }

          const diff =
            parseTimeToMinutes(a.session.content.time) -
            parseTimeToMinutes(b.session.content.time);
          if (diff !== 0) return diff;

          return a.sourceIndex - b.sourceIndex;
        })
        .map((item) => item.session);

      return [dayKey, sorted];
    }),
  ) as Record<DayKey, T[]>;

  return sortedByDay;
};

export const timeSinceMinutes = (timestamp: string): string => {
  const now = new Date();
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
