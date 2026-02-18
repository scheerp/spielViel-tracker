'use client';

import { useEffect, useState } from 'react';
import GameListItem from '@components/GameListItem';
import { Game } from '@context/GamesContext';
import FancyLoading from '@components/FancyLoading';
import ScrollToTopButton from '@components/ScrollTopButton';
import RotatedTitle from '@components/RotatedTitle';

const FavouritesPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [favourites, setFavourites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [noFavourites, setNoFavourites] = useState(false);

  useEffect(() => {
    const fetchFavouriteGames = async () => {
      if (typeof window === 'undefined') return;

      const storedIds: number[] = JSON.parse(
        localStorage.getItem('favourites') || '[]',
      );

      if (!storedIds.length) {
        setNoFavourites(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games/by-ids`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(storedIds), // 👈 wichtig!
          },
        );

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Favoriten');
        }

        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteGames();
  }, []);

  const toggleFavourite = (gameId: number) => {
    const updated = favourites.filter((id) => id !== gameId);

    localStorage.setItem('favourites', JSON.stringify(updated));

    setFavourites(updated);
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  };

  if (loading) return <p>Lade Favoriten...</p>;

  return (
    <div className="mb-16 flex flex-col items-center">
      <RotatedTitle
        text="Favoriten"
        tailwindBgColor="bg-secondary"
        className="mb-0 mt-12"
      />
      <div className="container mx-auto mt-12 flex flex-col gap-8 px-2 md:mt-12 lg:flex-row lg:px-8">
        <div className="flex-grow">
          {noFavourites && !loading ? (
            <div className="px-4 py-16 pt-8 text-center text-gray-500">
              <p>
                Du hast noch keine Favoriten.
                <br />
                Klicke auf das Herz-Symbol bei einem Spiel, um es hier zu
                speichern.
              </p>
            </div>
          ) : (
            <div className="mb-8 px-4 text-center text-gray-500">
              <p className="mb-4 text-sm font-medium text-gray-500 md:mx-8">
                Hier findest du deine gespeicherten spiele
              </p>
            </div>
          )}
          {!noFavourites && (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {games.map((game) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  editFamiliarity={false}
                  isFavourite={true}
                  toggleFavourite={() => toggleFavourite(game.id)}
                />
              ))}
            </ul>
          )}
          {loading && <FancyLoading />}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default FavouritesPage;
