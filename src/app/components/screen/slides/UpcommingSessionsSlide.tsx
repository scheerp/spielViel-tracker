'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import RotatedTitle from '@components/RotatedTitle';
import { Session } from '@components/ProgramCard';
import {
  EVENT_TYPE_LABELS,
  getUpcomingSessionsForCurrentDay,
} from '@lib/utils';
import SessionCapacity from '@components/SessionCapacity';

const EVENT_TYPE_STYLE: Record<string, string> = {
  turnier: 'bg-error text-white',
  spielesession: 'bg-secondary text-white',
  penandpaper: 'bg-status text-white',
};

const getTimeLabel = (time?: string): string => {
  if (!time) return '';

  const [, trailingPart] = time.split(',', 2);
  return trailingPart?.trim() || time;
};

const buildHostAvatarSrc = (host?: string): string | undefined => {
  const value = (host ?? '').trim();
  if (!value) return undefined;

  const normalizedBase = value
    .replace(/[^\p{L}\p{N}\s&-]+/gu, '')
    .replace(/\s*&\s*/g, '-')
    .replace(/['’]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!normalizedBase) return undefined;

  const tokens = normalizedBase.split('-').filter(Boolean);
  const firstToken = tokens[0] ?? '';
  const restLower = tokens.slice(1).map((token) => token.toLowerCase());
  const normalizedFileName =
    restLower.length > 0 ? [firstToken, ...restLower].join('-') : firstToken;

  return `/hosts/${normalizedFileName}.webp`;
};

function HostAvatar({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) return null;

  return (
    <div className="absolute -bottom-3 -right-2 z-10 h-16 w-16 rounded-full bg-backgroundDark p-[3px] xl:h-20 xl:w-20">
      <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-foreground bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  );
}

export default function UpcommingSessionsSlide({
  data,
}: {
  data: Record<string, Session>;
}) {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const sessions: Session[] = Object.values(data);

  const upcomingSessions = useMemo(() => {
    return getUpcomingSessionsForCurrentDay(sessions, {
      limit: 4,
      searchParams,
      allowDevOverrides: isAdmin,
    });
  }, [isAdmin, searchParams, sessions]);

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden px-16 py-8">
      <RotatedTitle
        text="Programm"
        tailwindBgColor="bg-error"
        className="mb-16"
      />
      <span className="mb-14 text-xl font-semibold">
        Das sind unserer nächsten Spielesessions
      </span>

      <div className="w-full max-w-[1500px]">
        <div className="hidden w-full grid-cols-2 grid-rows-2 items-start gap-10 md:grid">
          {upcomingSessions.map((session, idx) => {
            const eventTypeRaw = (
              session.content.eventType ?? ''
            ).toLowerCase();
            const eventTypeLabel = EVENT_TYPE_LABELS[eventTypeRaw] ?? '';
            const eventTypeStyle =
              EVENT_TYPE_STYLE[eventTypeRaw] ?? 'bg-status text-white';
            const hostAvatarSrc = buildHostAvatarSrc(session.content.host);
            const hostAvatarAlt =
              session.content.hostAvatarAlt ??
              (session.content.host
                ? `Hostbild von ${session.content.host}`
                : 'Hostbild');

            return (
              <motion.aside
                key={session.content.id ?? `${session.content.title}-${idx}`}
                initial={{ y: 40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  delay: idx * 0.12,
                  type: 'spring',
                  stiffness: 260,
                  damping: 18,
                  mass: 0.8,
                }}
                className="relative flex w-full flex-col rounded-3xl border-[3px] border-foreground bg-backgroundDark p-4"
              >
                {session.content.time && (
                  <span className="absolute -top-4 left-1/2 w-52 -translate-x-1/2 rounded-full border-[3px] border-foreground bg-white px-3 py-1 text-center text-sm font-semibold [font-stretch:120%]">
                    {getTimeLabel(session.content.time)}
                  </span>
                )}

                <div className="mt-4 flex gap-4">
                  <div className="relative w-[42%] min-w-[9.5rem]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-[3px] border-foreground bg-white">
                      {session.content.image ? (
                        <Image
                          src={session.content.image.replace(
                            '../img/programm',
                            '/program',
                          )}
                          alt={
                            session.content.imageAlt ??
                            session.content.title ??
                            'Session Bild'
                          }
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <HostAvatar src={hostAvatarSrc} alt={hostAvatarAlt} />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h3 className="truncate text-2xl font-bold [font-stretch:125%]">
                      {session.content.title}
                    </h3>

                    {eventTypeLabel && (
                      <div className="mt-2">
                        <span
                          className={`rounded-full border-2 border-foreground px-3 py-[4px] text-sm font-semibold [font-stretch:120%] ${eventTypeStyle}`}
                        >
                          {eventTypeLabel}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 space-y-1 text-sm">
                      {session.content.players && (
                        <p>
                          <span className="font-semibold">Anzahl:</span>{' '}
                          {session.content.players}
                        </p>
                      )}
                      {session.content.duration && (
                        <p>
                          <span className="font-semibold">Dauer:</span>{' '}
                          {session.content.duration}
                        </p>
                      )}
                      {session.content.host && (
                        <p>
                          <span className="font-semibold">Leitung:</span>{' '}
                          {session.content.host}
                        </p>
                      )}
                      {session.content.room && (
                        <p>
                          <span className="font-semibold">Raum:</span>{' '}
                          {session.content.room}
                        </p>
                      )}
                    </div>

                    <div className="mt-3">
                      <SessionCapacity session={session} />
                    </div>
                  </div>
                </div>
              </motion.aside>
            );
          })}
        </div>

        <div className="md:hidden">
          <p className="text-center text-sm text-gray-600">
            Diese Ansicht ist für große Screens optimiert.
          </p>
        </div>
      </div>
    </div>
  );
}
