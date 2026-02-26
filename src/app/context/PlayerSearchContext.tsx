'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ComplexityType } from '@lib/utils';

type PlayerSearchContextType = {
  openGames: FlatPlayerSearchWithGame[];
  expiredGames: FlatPlayerSearchWithGame[];
  reload: () => Promise<void>;
};

export type PlayerSearch = {
  can_edit: boolean;
  created_at: string;
  game_id: number;
  id: number;
  name: string;
  player_id: number;
  location: string;
  current_players: number;
  details: string | null;
  is_valid: boolean;
  players_needed: number;
  edit_token: string | null;
};

export type PlayerSearchByGame = {
  game: {
    id: number;
    name: string;
    img_url: string;
    thumbnaul_url: string;
    best_playercount: number;
    min_players: number;
    max_players: number;
    min_playtime: number;
    max_playtime: number;
    complexity_label?: ComplexityType;
    player_age: number;
  };
  player_searches: PlayerSearch[];
};

export type FlatPlayerSearchWithGame = {
  game: {
    id: number;
    name: string;
    img_url: string;
    thumbnaul_url: string;
    best_playercount: number;
    min_players: number;
    max_players: number;
    min_playtime: number;
    max_playtime: number;
    complexity_label?: ComplexityType;
    player_age: number;
  };
  player_search: PlayerSearch;
};

export type CategorizedFlatPlayerSearches = {
  valid: FlatPlayerSearchWithGame[];
  expired: FlatPlayerSearchWithGame[];
};

const DEFAULT_EXPIRE_MINUTES = '30';

export const categorizePlayerSearches = (playerSearches: PlayerSearch[]) => {
  const valid = playerSearches.filter((p) => p.is_valid);
  const expired = playerSearches.filter((p) => p.is_valid === false);

  valid.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  expired.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return { valid, expired };
};

export const flattenAndCategorizePlayerSearches = (
  playerSearches: PlayerSearchByGame[],
) => {
  const flattened = playerSearches.flatMap((entry) =>
    entry.player_searches.map((ps) => ({
      game: entry.game,
      player_search: ps,
    })),
  );

  const categorized = categorizePlayerSearches(
    flattened.map((f) => f.player_search),
  );

  const validIds = new Set(categorized.valid.map((v) => v.id));
  const expiredIds = new Set(categorized.expired.map((e) => e.id));

  return {
    valid: flattened.filter((f) => validIds.has(f.player_search.id)),
    expired: flattened.filter((f) => expiredIds.has(f.player_search.id)),
  };
};

const PlayerSearchContext = createContext<PlayerSearchContextType | undefined>(
  undefined,
);

export const usePlayerSearch = () => {
  const ctx = useContext(PlayerSearchContext);
  if (!ctx)
    throw new Error('usePlayerSearch must be used within PlayerSearchProvider');
  return ctx;
};

export const PlayerSearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [allSearches, setAllSearches] = useState<PlayerSearchByGame[]>([]);
  const [openGames, setOpenGames] = useState<FlatPlayerSearchWithGame[]>([]);
  const [expiredGames, setExpiredGames] = useState<FlatPlayerSearchWithGame[]>(
    [],
  );

  const queryParams = new URLSearchParams();
  queryParams.append('expire_after_minutes', DEFAULT_EXPIRE_MINUTES);

  const reload = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/player_search?${queryParams.toString()}`,
      );
      const data = (await res.json()) as PlayerSearchByGame[];
      setAllSearches(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setOpenGames(flattenAndCategorizePlayerSearches(allSearches).valid);
    setExpiredGames(flattenAndCategorizePlayerSearches(allSearches).expired);
  }, [allSearches]);

  return (
    <PlayerSearchContext.Provider value={{ openGames, expiredGames, reload }}>
      {children}
    </PlayerSearchContext.Provider>
  );
};
