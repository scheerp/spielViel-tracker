'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import RotatedTitle from '@components/RotatedTitle';
import ProgramCard, { Session } from '@components/ProgramCard';
import {
  DAY_KEYS,
  DAY_LABELS,
  DAY_ORDER_INDEX,
  DayKey,
  EVENT_START,
  getCurrentEventReference,
  groupSessionsByDay,
  isAllDaySession,
  parseTimeToMinutes,
} from '@lib/utils';
import ScrollToTopButton from '@components/ScrollTopButton';
import Loading from '@components/Loading';
import { loadProgramSessions } from '@lib/programData';

export default function ProgramPage() {
  const [devSearchParams, setDevSearchParams] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const markerRefs = useRef<Partial<Record<DayKey, HTMLDivElement | null>>>({});
  const mobileSessionRefs = useRef<
    Partial<Record<DayKey, HTMLDivElement | null>>
  >({});
  const hasScrolledToMarker = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDevSearchParams(window.location.search);
  }, []);

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      setError(null);

      try {
        const loadedSessions = await loadProgramSessions();
        setSessions(loadedSessions);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, []);

  const sessionsByDay = groupSessionsByDay(sessions);

  const currentReference = useMemo(
    () =>
      getCurrentEventReference({
        searchParams: devSearchParams,
        allowDevOverrides: true,
      }),
    [devSearchParams],
  );

  const shouldShowTimelineAndAutoScroll = useMemo(() => {
    if (currentReference.hasDayOverride || currentReference.hasTimeOverride) {
      return true;
    }

    return new Date() >= EVENT_START;
  }, [currentReference.hasDayOverride, currentReference.hasTimeOverride]);

  const timelineProgressByDay = useMemo(() => {
    const progress: Record<DayKey, number | null> = {
      FRI: null,
      SAT: null,
      SUN: null,
      OTHER: null,
    };

    if (!shouldShowTimelineAndAutoScroll) {
      return progress;
    }

    DAY_KEYS.forEach((dayKey) => {
      const daySessions = sessionsByDay[dayKey] ?? [];

      const sessionMinutes = daySessions
        .filter((session) => !isAllDaySession(session.content.time))
        .map((session) => parseTimeToMinutes(session.content.time))
        .filter((minutes) => minutes !== Number.MAX_SAFE_INTEGER)
        .sort((a, b) => a - b);

      if (sessionMinutes.length === 0) {
        progress[dayKey] = null;
        return;
      }

      const dayStart = sessionMinutes[0];
      const dayEnd = sessionMinutes[sessionMinutes.length - 1];

      if (dayKey !== currentReference.dayKey) {
        progress[dayKey] =
          DAY_ORDER_INDEX[dayKey] < DAY_ORDER_INDEX[currentReference.dayKey]
            ? 100
            : 0;
        return;
      }

      if (dayEnd === dayStart) {
        progress[dayKey] = currentReference.minutes >= dayStart ? 100 : 0;
        return;
      }

      const currentProgress =
        ((currentReference.minutes - dayStart) / (dayEnd - dayStart)) * 100;

      progress[dayKey] = Math.max(0, Math.min(100, currentProgress));
    });

    return progress;
  }, [
    currentReference.dayKey,
    currentReference.minutes,
    sessionsByDay,
    shouldShowTimelineAndAutoScroll,
  ]);

  const mobileScrollTargetByDay = useMemo(() => {
    const targets: Record<DayKey, number | null> = {
      FRI: null,
      SAT: null,
      SUN: null,
      OTHER: null,
    };

    if (!shouldShowTimelineAndAutoScroll) {
      return targets;
    }

    const dayKey = currentReference.dayKey;
    const daySessions = sessionsByDay[dayKey] ?? [];

    if (daySessions.length === 0) {
      return targets;
    }

    const nextSessionIndex = daySessions.findIndex((session) => {
      if (isAllDaySession(session.content.time)) return false;
      const minutes = parseTimeToMinutes(session.content.time);
      if (minutes === Number.MAX_SAFE_INTEGER) return false;
      return minutes >= currentReference.minutes;
    });

    targets[dayKey] = nextSessionIndex >= 0 ? nextSessionIndex : 0;

    return targets;
  }, [
    currentReference.dayKey,
    currentReference.minutes,
    sessionsByDay,
    shouldShowTimelineAndAutoScroll,
  ]);

  useEffect(() => {
    if (hasScrolledToMarker.current) return;
    if (loading) return;
    if (!shouldShowTimelineAndAutoScroll) return;

    const targetDay = currentReference.dayKey;
    const targetMarker = markerRefs.current[targetDay];
    const mobileTarget = mobileSessionRefs.current[targetDay];
    const targetProgress = timelineProgressByDay[targetDay];

    const isDesktopViewport =
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px)').matches;

    if (isDesktopViewport && targetMarker && targetProgress !== null) {
      targetMarker.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasScrolledToMarker.current = true;
      return;
    }

    if (!isDesktopViewport && mobileTarget) {
      mobileTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasScrolledToMarker.current = true;
    }
  }, [
    currentReference.dayKey,
    loading,
    mobileScrollTargetByDay,
    shouldShowTimelineAndAutoScroll,
    timelineProgressByDay,
  ]);

  if (loading || !sessions || sessions?.length === 0) return <Loading />;
  if (error)
    return (
      <p>
        Hoppla. Hier ist leider ein Fehler aufgetreten. Versuche es später
        nochmal.
      </p>
    );

  return (
    <div className="mb-16 flex flex-col items-center lg:mx-4">
      <RotatedTitle
        text="Programm"
        tailwindBgColor="bg-error"
        className="my-12"
      />
      {sessions && sessions?.length > 0 && (
        <p className="mb-8 max-w-3xl px-8 text-center text-gray-700">
          Hier findest du alle Informationen zu unseren Spielesessions,
          Turnieren und Pen & Paper-Runden auf der SpielViel und kannst dich
          direkt anmelden. In unseren Spielesessions und Pen & Paper-Runden
          lernst du Spiele und Spielsysteme in entspannter Atmosphäre kennen.
          Eine erfahrene Sessionleitung erklärt dir die Regeln Schritt für
          Schritt und begleitet dich durch die gesamte Partie. Perfekt, um neue
          auch komplexere Spiele und Spielsysteme in Ruhe auszuprobieren und
          kennenzulernen.
        </p>
      )}

      {!sessions || sessions?.length === 0 ? (
        <div className="mx-auto max-w-7xl rounded-2xl border-[3px] border-foreground bg-backgroundDark p-7 text-center font-medium [font-stretch:112%]">
          <p className="mb-2 text-lg">Noch ein kleinens bisschen Geduld</p>
          <p className="mb-2">
            Bald findest du hier alle Infos zum Programm und kannst dich zu
            Spielesessions, Turnieren und Pen & Paper anmelden.
          </p>
          <p>Schau&apos; einfach in ein paar Tagen nochmal vorbei.</p>
        </div>
      ) : (
        <div className="max-w-7xl space-y-16">
          {DAY_KEYS.map((dayKey) => {
            const daySessions = sessionsByDay[dayKey];
            if (!daySessions || daySessions.length === 0) return null;

            const leftSessions: Session[] = daySessions.filter(
              (_, idx) => idx % 2 === 0,
            );
            const rightSessions: Session[] = daySessions.filter(
              (_, idx) => idx % 2 !== 0,
            );

            return (
              <div
                key={dayKey}
                className={`program-day p-6 pt-0 md:rounded-[28px] md:border-2 md:border-foreground md:p-28 md:pt-0 ${dayKey === 'SAT' ? 'bg-[#FFEAE6]' : 'bg-[#FFF4E6]'}`}
              >
                <div className="program-day-header pointer-events-none sticky top-20 z-10 mb-4 flex justify-center">
                  <h2 className="program-day-label mb-6 mt-6 inline-flex items-center justify-center rounded-full border-[3px] border-foreground bg-white px-12 py-2 text-xl font-semibold shadow-darkBottom [font-stretch:125%]">
                    {DAY_LABELS[dayKey]}
                  </h2>
                </div>

                <div className="flex flex-col gap-8 md:hidden">
                  {daySessions.map((s, idx) => (
                    <div
                      key={s.content.id ?? `${s.content.title}-${idx}`}
                      ref={(el) => {
                        if (
                          dayKey === currentReference.dayKey &&
                          mobileScrollTargetByDay[dayKey] === idx
                        ) {
                          mobileSessionRefs.current[dayKey] = el;
                        }
                      }}
                    >
                      <ProgramCard session={s} />
                    </div>
                  ))}
                </div>

                <div className="hidden gap-28 md:grid md:grid-cols-[1fr_auto_1fr]">
                  <div className="flex h-full flex-col gap-8">
                    {leftSessions.map((s, idx) => (
                      <ProgramCard
                        key={s.content.id ?? `${s.content.title}-${idx}`}
                        session={s}
                      />
                    ))}
                  </div>
                  <div className="relative hidden h-full w-2 rounded-lg bg-[#E6D5B8] md:block">
                    {timelineProgressByDay[dayKey] !== null && (
                      <>
                        <div
                          className="absolute left-0 top-0 w-full rounded-lg bg-primary"
                          style={{
                            height: `${timelineProgressByDay[dayKey]}%`,
                          }}
                        />
                        <div
                          ref={(el) => {
                            markerRefs.current[dayKey] = el;
                          }}
                          className="absolute left-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 border-foreground bg-primary"
                          style={{ top: `${timelineProgressByDay[dayKey]}%` }}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-8 md:mt-20">
                    {rightSessions.map((s, idx) => (
                      <ProgramCard
                        key={s.content.id ?? `${s.content.title}-${idx}`}
                        session={s}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
}
