import { Game } from '@context/GamesContext';
import Image from 'next/image';

const DetailedGameImage = ({ game }: { game: Game }) => {
  return (
    <div className="relative w-80 flex-shrink-0 overflow-hidden truncate rounded-l-md md:w-[500px]">
      <Image
        className={`${!game?.available && 'opacity-60'}`}
        src={game?.img_url || '/noImage.jpg'}
        alt={game?.name}
        width={800}
        height={900}
      />
      {!game.available && (
        <div
          className="absolute -left-14 top-[105px] origin-top-left -rotate-45 transform bg-red-500 px-6 py-2 text-center text-sm font-bold text-white"
          style={{
            width: '230px',
            height: '40px',
          }}
        >
          Verliehen
        </div>
      )}
      <div className="text-md z-1 absolute bottom-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg">
        {game.available}
      </div>
    </div>
  );
};
export default DetailedGameImage;
