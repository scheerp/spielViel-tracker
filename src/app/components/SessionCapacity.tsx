import { Session } from './ProgramCard';

interface SessionCapacityProps {
  session: Session;
}

const SessionCapacity: React.FC<SessionCapacityProps> = ({ session }) => {
  const occupied = session?.occupied ?? 0;
  const total = session?.total ?? 0;
  const percent =
    total > 0 ? Math.min(100, Math.max(0, (occupied / total) * 100)) : 0;
  const isSoldOut = total > 0 && occupied >= total;

  return (
    <div className="program-card-availability mt-4 [font-stretch:125%]">
      {isSoldOut ? (
        <span className="text-sm font-medium text-[#475569]">
          Leider schon ausgebucht. Warteliste verfügbar.
        </span>
      ) : (
        <span className="font-semibold">
          Belegte Plätze {occupied} / {total}
        </span>
      )}

      <div className="program-card-progress relative mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-foreground bg-white">
        <span
          className={`absolute left-0 top-0 h-full ${percent === 100 ? 'bg-[#94A3B8]' : 'bg-primary'}`}
          style={{ width: `${percent}%` }}
        ></span>
      </div>
    </div>
  );
};
export default SessionCapacity;
