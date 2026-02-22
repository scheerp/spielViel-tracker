import { EVENT_TYPE_LABELS } from '@lib/utils';
import Image from 'next/image';
import ArrowIcon from '@icons/ArrowIcon';
import Clickable from './Clickable';
import SessionCapacity from './SessionCapacity';

export interface Session {
  content: {
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
    id?: string;
  };
  available: number;
  occupied: number;
  status: string;
  title: string;
  total: number;
}

interface ProgramCardProps {
  session: Session;
  mobileOrder?: number;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ session, mobileOrder }) => {
  const eventTypeRaw = (session?.content?.eventType ?? '').toLowerCase();
  const eventTypeLabel = EVENT_TYPE_LABELS[eventTypeRaw] ?? '';
  const bgColor =
    eventTypeRaw === 'turnier'
      ? 'bg-error text-white'
      : eventTypeRaw === 'spielesession'
        ? 'bg-secondary text-white'
        : 'bg-status text-white';

  return (
    <article
      className="mb-6 flex flex-col md:w-80"
      style={mobileOrder !== undefined ? { order: mobileOrder } : undefined}
    >
      <div className="program-card relative flex flex-col rounded-3xl border-[3px] border-foreground bg-[#F7E8D0] p-10">
        <span className="clamp-custom-2 absolute -top-4 left-1/2 w-56 -translate-x-1/2 transform rounded-full border-[3px] border-foreground bg-white px-4 py-1 text-center font-semibold [font-stretch:120%]">
          {session?.content?.time}
        </span>
        <div className="flex flex-col">
          {session?.content?.image && (
            <div className="program-card-image relative mt-4 h-48 w-56 flex-shrink-0 self-center rounded-2xl border-[3px] border-foreground md:mt-0">
              <Image
                src={session?.content?.image.replace(
                  '../img/programm',
                  '/program',
                )}
                alt={
                  session?.content?.imageAlt ??
                  session?.content?.title ??
                  'Session Bild'
                }
                fill
                className="rounded-xl object-cover"
              />
            </div>
          )}
          <h2 className="program-card-title mb-2 mt-6 text-[1.75rem] font-bold [font-stretch:125%]">
            {session?.content?.title}
          </h2>

          {eventTypeLabel && (
            <div className={`rounded-full`}>
              <span
                className={`text-shadow-outline-dark text-md rounded-full border-2 border-foreground px-3 py-[4px] font-semibold [font-stretch:120%] ${bgColor}`}
              >
                {eventTypeLabel}
              </span>
            </div>
          )}

          <div className="program-card-meta text-md mt-3 space-y-1">
            {session?.content?.players && (
              <p>
                <span className="font-[500]">Anzahl:</span>{' '}
                {session?.content?.players}
              </p>
            )}
            {session?.content?.duration && (
              <p>
                <span className="font-[500]">Dauer:</span>{' '}
                {session?.content?.duration}
              </p>
            )}
            {session?.content?.host && (
              <p>
                <span className="font-[500]">Leitung:</span>{' '}
                {session?.content?.host}
              </p>
            )}
            {session?.content?.room && (
              <p>
                <span className="font-[500]">Raum:</span>{' '}
                {session?.content?.room}
              </p>
            )}
          </div>

          <SessionCapacity session={session} />

          <Clickable className="mt-6 rounded-xl">
            <a
              className="flex w-full justify-center rounded-lg bg-primary py-2 font-semibold text-white transition [font-stretch:120%]"
              //   TODO: this should not lead to stage
              href={
                'https://stage.spielviel.net/programm/' + session?.content?.link
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Mehr erfahren
              <ArrowIcon
                direction="right"
                tailwindColor="text-white"
                className="ml-2 h-5 w-5 pt-[2px]"
              />
            </a>
          </Clickable>
        </div>
      </div>
    </article>
  );
};

export default ProgramCard;
