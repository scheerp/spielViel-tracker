'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  DAY_LABELS,
  EventPhase,
  EVENT_END,
  EVENT_START,
  getCurrentEventReference,
  getEventPhase,
  isWithinEvent,
} from '@lib/utils';

type DebugSnapshot = {
  search: string;
  dateLabel: string;
  dayLabel: string;
  eventStatus: string;
  minutes: number;
  hasDayOverride: boolean;
  hasTimeOverride: boolean;
  withinEvent: boolean;
};

const formatMinutes = (minutes: number): string => {
  const normalized = Math.max(0, Math.min(24 * 60 - 1, minutes));
  const hours = String(Math.floor(normalized / 60)).padStart(2, '0');
  const mins = String(normalized % 60).padStart(2, '0');
  return `${hours}:${mins}`;
};

const EVENT_PHASE_LABELS: Record<EventPhase, string> = {
  'before-event': 'vor Event',
  'during-event': 'während Event',
  'after-event': 'nach Event',
  'before-day-window': 'vor Eventzeit',
  'after-day-window': 'nach Eventzeit',
  'outside-event-day': 'kein Eventtag',
};

const getEventStatus = (phase: EventPhase): string => {
  return EVENT_PHASE_LABELS[phase];
};

const readSnapshot = (
  search: string,
  allowDevOverrides: boolean,
): DebugSnapshot => {
  const now = new Date();
  const reference = getCurrentEventReference({
    now,
    searchParams: search,
    allowDevOverrides,
  });

  const phase = getEventPhase({ now, searchParams: search, allowDevOverrides });
  const withinEvent = isWithinEvent({
    searchParams: search,
    allowDevOverrides,
  });
  const effectiveDate = reference.simulatedDate ?? now;

  return {
    search,
    dateLabel: effectiveDate.toLocaleDateString('de-DE'),
    dayLabel: DAY_LABELS[reference.dayKey],
    eventStatus: getEventStatus(phase),
    minutes: reference.minutes,
    hasDayOverride: reference.hasDayOverride,
    hasTimeOverride: reference.hasTimeOverride,
    withinEvent,
  };
};

export default function DevTimeDebugOverlay() {
  const isLocalDev = process.env.NODE_ENV !== 'production';
  const { data: session, status } = useSession();
  const isAdmin = status === 'authenticated' && session?.user?.role === 'admin';
  const canShowHud = isLocalDev || isAdmin;
  const searchParams = useSearchParams();

  const snapshot = useMemo(() => {
    return readSnapshot(
      searchParams.toString() ? `?${searchParams.toString()}` : '',
      isAdmin,
    );
  }, [isAdmin, searchParams]);

  const eventRange = useMemo(() => {
    const start = EVENT_START.toLocaleDateString('de-DE');
    const end = EVENT_END.toLocaleDateString('de-DE');
    return `${start} – ${end}`;
  }, []);

  const hasSimulatedValues =
    snapshot.hasDayOverride || snapshot.hasTimeOverride;

  if (!canShowHud || !hasSimulatedValues) return null;

  return (
    <aside className="fixed left-3 top-3 z-[1000] w-[22rem] max-w-[calc(100vw-1.5rem)] rounded bg-black/70 p-3 font-mono text-xs text-white">
      <div className="mb-2 font-bold">DEV-Zeitdebug</div>

      <div className="mb-2 border-b border-white/20 pb-2">
        <div className="grid grid-cols-[7rem_1fr] gap-y-1">
          <div className="text-white/70">Datum</div>
          <div>
            {snapshot.dateLabel}
            {snapshot.hasDayOverride ? (
              <span className="font-semibold text-error"> (simuliert)</span>
            ) : (
              ''
            )}
          </div>
          <div className="text-white/70">Uhrzeit</div>
          <div>
            {formatMinutes(snapshot.minutes)}
            {snapshot.hasTimeOverride ? (
              <span className="font-semibold text-error"> (simuliert)</span>
            ) : (
              ''
            )}
          </div>
          <div className="text-white/70">eventTag</div>
          <div>
            {snapshot.dayLabel}
            {snapshot.hasDayOverride ? (
              <span className="font-semibold text-error"> (simuliert)</span>
            ) : (
              ''
            )}
          </div>
          <div className="text-white/70">eventStatus</div>
          <div>
            {snapshot.eventStatus}
            {snapshot.hasDayOverride ? (
              <span className="font-semibold text-error"> (simuliert)</span>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[7rem_1fr] gap-y-1">
        <div className="text-white/70">overrideTag</div>
        <div>{snapshot.hasDayOverride ? 'ja' : 'nein'}</div>
        <div className="text-white/70">overrideZeit</div>
        <div>{snapshot.hasTimeOverride ? 'ja' : 'nein'}</div>
        <div className="text-white/70">eventFenster</div>
        <div>{eventRange}</div>
        <div className="text-white/70">query</div>
        <div className="truncate">{snapshot.search || '(leer)'}</div>
      </div>
    </aside>
  );
}
