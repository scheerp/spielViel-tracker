import { Game } from '@context/GamesContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const DetailedGameImage = ({ game }: { game: Game }) => {
  const { data: session } = useSession();

  return (
    <div className="relative w-80 flex-shrink-0 overflow-hidden truncate md:w-[500px]">
      <Image
        className={`${!game?.available && 'opacity-60'}`}
        src={game?.img_url || '/noImage.jpg'}
        alt={game?.name}
        width={800}
        height={900}
      />
      {session && (
        <div className="text-md z-1 text-md absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white shadow-lg">
          {game.available}
        </div>
      )}
    </div>
  );
};
export default DetailedGameImage;
