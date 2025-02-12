import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ComplexityType } from '@lib/utils';

export interface Game {
  id: number;
  name: string;
  bgg_id: number;
  description: string;
  german_description: string;
  similar_games: number[];
  tags: string;
  available: number;
  borrow_count: number;
  quantity: number;
  year_published: number;
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  playing_time: number;
  rating: number;
  complexity: number;
  complexity_label?: ComplexityType;
  img_url?: string;
  thumbnail_url?: string;
  ean?: string;
  player_age: string;
}

interface GamesContextType {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  totalCount: number;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateGame: (updatedGame: Game) => void;
}

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const updateGame = (updatedGame: Game) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === updatedGame.id ? { ...game, ...updatedGame } : game,
      ),
    );
  };

  return (
    <GamesContext.Provider
      value={{
        games,
        setGames,
        offset,
        setOffset,
        hasMore,
        setHasMore,
        totalCount,
        setTotalCount,
        loading,
        setLoading,
        updateGame,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
};

export const useGames = (): GamesContextType => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
};
