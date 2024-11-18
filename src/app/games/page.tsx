"use client";

import FilterCard from "@components/FilterCard";
import { filterGames, sortGames } from "@lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export interface Game {
  id: number;
  name: string;
  img_url: string;
  bgg_id: number;
  is_available: boolean;
}

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Array<Game>>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games`
        );
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Spiele");
        }
        const data = await response.json();
        setGames(data);
        setFilteredGames(data);
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (!games) return;

    const filtered = filterGames(games, filterText, showAvailableOnly);
    const sorted = sortGames(filtered, sortOption);

    setFilteredGames(sorted);
  }, [filterText, sortOption, showAvailableOnly, games]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <FilterCard
        filterText={filterText}
        setFilterText={setFilterText}
        sortOption={sortOption}
        setSortOption={setSortOption}
        showAvailableOnly={showAvailableOnly}
        setShowAvailableOnly={setShowAvailableOnly}
      />
      <ul>
        {filteredGames?.map((game) => (
          <li
            key={game.id}
            className={`m-5 ${!game.is_available && "opacity-40"}`}
          >
            {/* <a href={`https://boardgamegeek.com/boardgame/${game.bgg_id}`}> */}
            <Link
              href={{
                pathname: `/game/${game.id}`,
                query: { bgg_id: game.bgg_id },
              }}
            >
              <div className="flex items-center">
                <Image
                  className="mr-5"
                  src={game.img_url}
                  alt={game.name}
                  width={80}
                  height={80}
                />
                <h2>{game.name}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Games;
