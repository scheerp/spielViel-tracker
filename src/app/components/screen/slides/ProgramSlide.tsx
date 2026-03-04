'use client';

import { useState } from 'react';
import RotatedTitle from '@components/RotatedTitle';
import ProgramCard, { Session } from '@components/ProgramCard';
import { DAY_KEYS, DAY_LABELS, groupSessionsByDay } from '@lib/utils';
import ScrollToTopButton from '@components/ScrollTopButton';

export default function ProgramSlide({
  data,
}: {
  data: Record<string, Session>;
}) {
  const [timelineProgress, setTimelineProgress] = useState(0);

  const sessions: Session[] = Object.values(data);
  const sessionsByDay = groupSessionsByDay(sessions);

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden px-16 py-8">
      <RotatedTitle
        text="Programm"
        tailwindBgColor="bg-error"
        className="mb-16"
      />

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
              className={`program-day rounded-[28px] border-2 border-foreground p-6 pt-0 md:p-28 md:pt-0 ${dayKey === 'SAT' ? 'bg-[#FFEAE6]' : 'bg-[#FFF4E6]'}`}
            >
              <div className="program-day-header pointer-events-none sticky top-20 z-10 mb-4 flex justify-center">
                <h2 className="program-day-label mb-6 mt-6 inline-flex items-center justify-center rounded-full border-[3px] border-foreground bg-white px-12 py-2 text-xl font-semibold shadow-darkBottom [font-stretch:125%]">
                  {DAY_LABELS[dayKey]}
                </h2>
              </div>

              <div className="grid gap-24 md:grid-cols-[1fr_auto_1fr]">
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
      <ScrollToTopButton />
    </div>
  );
}
