'use client';

import { useEffect, useState } from 'react';
import RotatedTitle from '@components/RotatedTitle';
import ProgramCard, { Session } from '@components/ProgramCard';
import {
  DAY_KEYS,
  DAY_LABELS,
  DayKey,
  getSessionDayKey,
  parseTimeToMinutes,
} from '@lib/utils';
import ScrollToTopButton from '@components/ScrollTopButton';
import Loading from '@components/Loading';

type SessionWithIndex = Session & { __source_index: number };

export const groupSessionsByDay = (sessions: Session[]) => {
  const grouped: Record<DayKey, SessionWithIndex[]> = {
    FRI: [],
    SAT: [],
    SUN: [],
    OTHER: [],
  };

  sessions.forEach((session, index) => {
    const dayKey = getSessionDayKey(session.content.time);

    grouped[dayKey].push({
      ...session,
      __source_index: index,
    });
  });

  Object.values(grouped).forEach((list) => {
    list.sort((a, b) => {
      const diff =
        parseTimeToMinutes(a.content.time) - parseTimeToMinutes(b.content.time);
      if (diff !== 0) return diff;

      return (a.__source_index ?? 0) - (b.__source_index ?? 0);
    });
  });

  return grouped;
};

export default function ProgramPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          'https://spielviel.net/programm/api_availability.php',
        );

        if (!response.ok) {
          throw new Error(
            `Fehler beim Laden des Programms: ${response.status}`,
          );
        }

        const data = await response.json();
        const sessionsData = data.data;

        const sessions: Session[] = Object.values(sessionsData);
        setSessions(sessions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, []);

  const sessionsByDay = groupSessionsByDay(sessions);

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

                <div className="grid gap-28 md:grid-cols-[1fr_auto_1fr]">
                  <div className="flex h-full flex-col gap-8">
                    {leftSessions.map((s, idx) => (
                      <ProgramCard
                        key={s.content.id ?? `${s.content.title}-${idx}`}
                        session={s}
                      />
                    ))}
                  </div>
                  <div className="invisible h-full w-2 rounded-lg bg-[#E6D5B8] md:visible"></div>
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
