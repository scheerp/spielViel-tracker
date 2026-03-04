import { FlatPlayerSearchWithGame } from '@context/PlayerSearchContext';
import { timeSinceMinutes } from '@lib/utils';
import Image from 'next/image';

type OpenplayerSearchCardProps = {
  search: FlatPlayerSearchWithGame;
  index: number;
  markerClassName: string;
  cardBorderClassName: string;
};

const OpenplayerSearchCard = ({
  search,
  index,
  markerClassName,
  cardBorderClassName,
}: OpenplayerSearchCardProps) => {
  const playersNeeded = search.player_search.players_needed;
  const playersLabel =
    playersNeeded === 1
      ? '1 Mitspieler*in gesucht'
      : `${playersNeeded} Mitspieler*innen gesucht`;

  return (
    <article
      key={search.game.id + '-' + search.player_search.id}
      className={`relative h-full overflow-visible rounded-2xl border-[3px] border-foreground bg-backgroundDark px-2 py-2 ${cardBorderClassName}`}
    >
      <div
        className={`text-shadow-drop-shadow text-shadow-outline-dark absolute left-1 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground text-xl font-black text-white shadow-darkBottom ${markerClassName}`}
      >
        {index + 1}
      </div>

      <div className="flex h-full items-stretch gap-2">
        <div className="grid h-full min-w-0 flex-1 grid-cols-[auto_1fr] items-stretch gap-2.5">
          <div className="relative aspect-square h-full overflow-hidden rounded-lg border-2 border-foreground bg-white">
            <Image
              src={search.game.img_url || '/placeholder.png'}
              alt={search.game.name}
              fill
              sizes="(max-width: 1600px) 12vw, 220px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold [font-stretch:125%]">
              {search.game.name}
            </h3>

            <div className="text-md mt-1.5 space-y-0.5">
              <p>
                <span className="font-semibold">Name:</span>{' '}
                {search.player_search.name}
              </p>
              <p>
                <span className="font-semibold">Gesucht:</span> {playersLabel}
              </p>
              <p>
                <span className="font-semibold">Suche seit:</span>{' '}
                {timeSinceMinutes(search.player_search.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default OpenplayerSearchCard;
