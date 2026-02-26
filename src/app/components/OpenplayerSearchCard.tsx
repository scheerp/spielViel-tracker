import { FlatPlayerSearchWithGame } from '@context/PlayerSearchContext';
import LocationIcon from '@icons/LocationIcon';
import Image from 'next/image';
import ComplexityPill from './ComplexityPill';

type OpenplayerSearchCardProps = {
  search: FlatPlayerSearchWithGame;
  aspectRatio: number | null;
  setAspectRatio: (ratio: number) => void;
  index: number;
};

const OpenplayerSearchCard = ({
  search,
  aspectRatio,
  setAspectRatio,
  index,
}: OpenplayerSearchCardProps) => {
  const location = search.player_search?.location;

  return (
    <div
      key={search.game.id + '-' + search.player_search.id}
      className={`flex w-4/6 rounded-xl border-[3px] border-foreground bg-background p-6 ${index % 2 === 1 ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className="relative mx-auto w-full touch-none bg-gray-200">
        <div
          className="relative w-full"
          style={{
            aspectRatio: aspectRatio || undefined,
            height: aspectRatio ? undefined : 534.42, // Fallback-Höhe in px
          }}
        >
          <Image
            src="/floorplan.jpeg"
            alt="Raumplan"
            fill
            loading="eager"
            onLoad={(event) => {
              const target = event.target as HTMLImageElement;
              if (!aspectRatio) {
                setAspectRatio(target.naturalWidth / target.naturalHeight);
              }
            }}
          />
        </div>

        {location && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              top: `${+location.split(',')[1]}%`,
              left: `${+location.split(',')[0]}%`,
            }}
          >
            <LocationIcon className="h-6 w-6 text-primary md:h-8 md:w-8" />
          </div>
        )}
      </div>
      <div className="mb-4 flex flex-col">
        <div className="relative mr-4 h-28 w-36 overflow-hidden truncate rounded-lg border-[3px] border-foreground md:h-44 md:w-44">
          <Image
            src={search.game.img_url ? search.game.img_url : '/placeholder.png'}
            alt={search.game.name}
            priority
            fill
            sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="ml-3 flex max-w-[45%] flex-col justify-between md:mx-4 md:h-[9.3rem] md:max-w-[90%]">
          <h2 className="clamp-custom-1 mb-1 text-xl/6 [font-stretch:125%] md:text-lg lg:text-xl">
            {search.game.name}
          </h2>
          <div>
            <p className="mb-1 text-sm text-gray-500 md:block">
              {search.game.min_players === search.game.max_players
                ? `${search.game?.max_players} Spieler*innen`
                : `${search.game?.min_players} - ${search.game?.max_players} Spieler*innen`}
              <br />
              {search.game.min_playtime === search.game.max_playtime
                ? `${search.game?.max_playtime} Min`
                : `${search.game?.min_playtime} - ${search.game?.max_playtime} Min`}{' '}
              | {search.game.player_age}+
            </p>
            <ComplexityPill complexityName="Beginner" className="py-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenplayerSearchCard;
