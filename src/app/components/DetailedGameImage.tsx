import { Game } from '@context/GamesContext';
import FavouriteOffIcon from '@icons/FavouriteOffIcon';
import FavouriteOnIcon from '@icons/FavouriteOnIcon';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const DetailedGameImage = ({ game }: { game: Game }) => {
  const [isFavourite, setIsFavourite] = useState<boolean>(false);

  // Beim Mount prüfen, ob das Spiel bereits favorisiert ist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavourites = JSON.parse(
        localStorage.getItem('favourites') || '[]',
      );
      setIsFavourite(storedFavourites.includes(game.id));
    }
  }, [game.id]);

  const toggleFavourite = () => {
    if (typeof window === 'undefined') return;

    const storedFavourites: number[] = JSON.parse(
      localStorage.getItem('favourites') || '[]',
    );

    let updatedFavourites: number[];
    if (storedFavourites.includes(game.id)) {
      // Entfernen
      updatedFavourites = storedFavourites.filter((id) => id !== game.id);
      setIsFavourite(false);
    } else {
      // Hinzufügen
      updatedFavourites = [...storedFavourites, game.id];
      setIsFavourite(true);
    }

    localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };

  return (
    <div className="relative w-80 flex-shrink-0 overflow-hidden truncate md:w-[500px]">
      <Image
        className={`${!game?.available && 'opacity-60'}`}
        src={game?.img_url || '/placeholder.png'}
        alt={game?.name}
        width={800}
        height={900}
      />
      <div className="absolute left-[4px] top-[9px] z-10">
        <button
          className="h-12 w-12 md:h-16 md:w-16"
          onClick={(e) => {
            e.preventDefault();
            toggleFavourite();
          }}
        >
          {isFavourite ? (
            <FavouriteOnIcon className="h-16 w-16" />
          ) : (
            <FavouriteOffIcon className="h-16 w-16" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DetailedGameImage;
