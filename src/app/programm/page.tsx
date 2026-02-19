'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Session {
  slug?: string;
  time?: string;
  title?: string;
  eventType?: string;
  players?: string;
  duration?: string;
  host?: string;
  room?: string;
  occupied?: number;
  total?: number;
  image?: string;
  imageAlt?: string;
  link?: string;
  __source_index?: number;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  turnier: 'Turnier',
  spielesession: 'Spielesession',
  penandpaper: 'Pen & Paper',
};

const DAY_LABELS: Record<string, string> = {
  freitag: 'Freitag',
  samstag: 'Samstag',
  sonntag: 'Sonntag',
  other: 'Weitere Termine',
};

const groupSessionsByDay = (sessions: Session[]) => {
  const grouped: Record<string, Session[]> = {
    freitag: [],
    samstag: [],
    sonntag: [],
    other: [],
  };

  sessions.forEach((session, idx) => {
    const timeLower = (session.time ?? '').toLowerCase();
    if (timeLower.includes('freitag'))
      grouped.freitag.push({ ...session, __source_index: idx });
    else if (timeLower.includes('samstag'))
      grouped.samstag.push({ ...session, __source_index: idx });
    else if (timeLower.includes('sonntag'))
      grouped.sonntag.push({ ...session, __source_index: idx });
    else grouped.other.push({ ...session, __source_index: idx });
  });

  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => {
      const timeToMinutes = (t?: string) => {
        const match = t?.match(/(\d{1,2})[:.](\d{2})/);
        return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 9999;
      };
      const diff = timeToMinutes(a.time) - timeToMinutes(b.time);
      return diff === 0
        ? (a.__source_index ?? 0) - (b.__source_index ?? 0)
        : diff;
    });
  });

  return grouped;
};

interface ProgramCardProps {
  session: Session;
  mobileOrder?: number;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ session, mobileOrder }) => {
  const occupied = session.occupied ?? 0;
  const total = session.total ?? 0;
  const percent =
    total > 0 ? Math.min(100, Math.max(0, (occupied / total) * 100)) : 0;
  const isSoldOut = total > 0 && occupied >= total;
  const eventTypeRaw = (session.eventType ?? '').toLowerCase();
  const eventTypeLabel = EVENT_TYPE_LABELS[eventTypeRaw] ?? '';
  const link = session.slug
    ? `/programm/${session.slug}`
    : (session.link ?? '#');

  const bgColor =
    eventTypeRaw === 'turnier'
      ? 'bg-red-500 text-white'
      : eventTypeRaw === 'spielesession'
        ? 'bg-green-500 text-white'
        : 'bg-blue-500 text-white';

  return (
    <article
      className="program-slot mb-6"
      style={mobileOrder !== undefined ? { order: mobileOrder } : undefined}
    >
      <div className="program-card border-dark-color relative flex flex-col rounded-2xl border-2 bg-[#F7E8D0] p-10 md:flex-row">
        <div className="flex-1">
          <span className="program-card-time border-dark-color absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full border-2 bg-white px-4 py-1 text-sm font-semibold">
            {session.time}
          </span>
          <h2 className="program-card-title mb-2 mt-6 text-2xl font-bold">
            {session.title}
          </h2>

          {eventTypeLabel && (
            <span
              className={`program-card-event-type inline-block rounded-full px-3 py-1 text-xs font-semibold ${bgColor}`}
            >
              {eventTypeLabel}
            </span>
          )}

          <div className="program-card-meta mt-3 space-y-1 text-sm">
            {session.players && (
              <p>
                <strong>Anzahl:</strong> {session.players}
              </p>
            )}
            {session.duration && (
              <p>
                <strong>Dauer:</strong> {session.duration}
              </p>
            )}
            {session.host && (
              <p>
                <strong>Leitung:</strong> {session.host}
              </p>
            )}
            {session.room && (
              <p>
                <strong>Raum:</strong> {session.room}
              </p>
            )}
          </div>

          <div className="program-card-availability mt-4">
            {isSoldOut ? (
              <span className="font-semibold text-red-600">
                Leider schon ausgebucht. Warteliste verfügbar.
              </span>
            ) : (
              <span>
                Belegte Plätze {occupied} / {total}
              </span>
            )}

            <div className="program-card-progress border-dark-color relative mt-2 h-3 w-full overflow-hidden rounded-full border-2 bg-white">
              <span
                className="bg-main-color absolute left-0 top-0 h-full"
                style={{ width: `${percent}%` }}
              ></span>
            </div>
          </div>

          <a
            href={link}
            className="program-card-button bg-main-color mt-4 inline-flex w-full items-center justify-center rounded-lg py-2 text-white shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            Mehr erfahren
            <img src="/arrow_right.svg" alt="" className="ml-2 h-4 w-4" />
          </a>
        </div>

        {session.image && (
          <div className="program-card-image relative mt-4 h-48 w-full flex-shrink-0 md:ml-4 md:mt-0 md:h-48 md:w-48">
            <Image
              src={session.image}
              alt={session.imageAlt ?? session.title ?? 'Session Bild'}
              fill
              className="rounded-xl object-cover"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default function ProgramPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timelineProgress, setTimelineProgress] = useState(0);

  useEffect(() => {
    fetch('/program/program.json')
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data.sessions)
          ? data.sessions
          : Array.isArray(data)
            ? data
            : [];
        setSessions(arr);
        setTimelineProgress(data.timelineProgress ?? 0);
      })
      .catch((err) =>
        console.error('Fehler beim Laden von program.json:', err),
      );
  }, []);

  const sessionsByDay = groupSessionsByDay(sessions);

  return (
    <main className="program-page container mx-auto p-4">
      <section className="page-hero mb-8">
        <h1 className="mb-2 text-3xl font-bold">Programm</h1>
        {sessions.length > 0 && (
          <p className="page-intro text-gray-700">
            Hier findest du alle Informationen zu unseren Spielesessions,
            Turnieren und Pen & Paper-Runden auf der SpielViel und kannst dich
            direkt anmelden.
          </p>
        )}
      </section>

      {sessions.length === 0 ? (
        <section className="program-empty-state border-dark-color mx-auto max-w-xl rounded-2xl border-2 bg-[#F7E8D0] p-7 text-center">
          <p className="mb-2 text-lg font-medium">
            Noch ein kleinens bisschen Geduld
          </p>
          <p className="mb-2">
            Bald findest du hier alle Infos zum Programm und kannst dich zu
            Spielesessions, Turnieren und Pen & Paper anmelden.
          </p>
          <p>Schau&apos; einfach in ein paar Tagen nochmal vorbei.</p>
        </section>
      ) : (
        <div className="program-days space-y-12">
          {Object.keys(DAY_LABELS).map((dayKey) => {
            const daySessions = sessionsByDay[dayKey];
            if (!daySessions || daySessions.length === 0) return null;

            const leftSessions = daySessions.filter((_, idx) => idx % 2 === 0);
            const rightSessions = daySessions.filter((_, idx) => idx % 2 !== 0);

            return (
              <section
                key={dayKey}
                className={`program-day border-dark-color rounded-2xl border-2 p-6 md:p-8 bg-${dayKey}`}
              >
                <header className="program-day-header pointer-events-none sticky top-20 z-40 mb-4 flex justify-center">
                  <h2 className="program-day-label border-dark-color inline-flex items-center justify-center rounded-full border-2 bg-white px-4 py-2 text-xl font-semibold">
                    {DAY_LABELS[dayKey]}
                  </h2>
                </header>

                <div className="program-timeline grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="program-column left flex flex-col gap-8">
                    {leftSessions.map((s, idx) => (
                      <ProgramCard key={idx} session={s} mobileOrder={idx} />
                    ))}
                  </div>
                  <div className="program-column right flex flex-col gap-8">
                    {rightSessions.map((s, idx) => (
                      <ProgramCard key={idx} session={s} mobileOrder={idx} />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
