'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import SearchIcon from '@icons/SearchIcon';

export type GameSearchResult = {
  id: number;
  name: string;
  img_url?: string | null;
  thumbnail_url?: string | null;
  min_players?: number | null;
  max_players?: number | null;
  min_playtime?: number | null;
  max_playtime?: number | null;
  best_playercount?: number | null;
  complexity_label?: string | null;
  player_age?: number | null;
};

type Props = {
  onSelect: (game: GameSearchResult) => void;
  onSearchChange?: (query: string) => void;
  selectedGameId?: number | null;
  onClearSelection?: () => void;
};

export default function GameSearchSelect({
  onSelect,
  onSearchChange,
  selectedGameId,
  onClearSelection,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const skipNextFetchRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchGames(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchGames = async (search: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/search?query=${encodeURIComponent(search)}&limit=10`,
      );

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setResults(data);
      setOpen(true);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (game: GameSearchResult) => {
    skipNextFetchRef.current = true;
    onSelect(game);
    setQuery(game.name);
    setOpen(false);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    onSearchChange?.(value);
  };

  const clearSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setQuery('');
    setResults([]);
    setOpen(false);
    setLoading(false);
    onSearchChange?.('');
    onClearSelection?.();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="rounded-xl border-[3px] border-foreground bg-white px-3 shadow-darkBottom">
        <div className="relative flex w-full items-center py-2 pr-3">
          <SearchIcon
            tailwindColor="text-primary"
            className="ml-[0.1rem] mr-2 h-[1.7rem] w-[1.7rem]"
          />
          <input
            type="text"
            placeholder="Spiel suchen..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            className="mr-1 w-full border-0 bg-white py-1.5 pr-0 text-lg outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Suche leeren"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-foreground-dark mt-3 px-1 text-sm font-medium">
          Lade Spiele...
        </div>
      )}

      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border-[3px] border-foreground bg-background shadow-darkBottom">
          {results.map((game) => (
            <li
              key={game.id}
              className="border-foreground/20 border-b-[2px] last:border-b-0"
            >
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(game)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-backgroundDark ${selectedGameId === game.id ? 'bg-backgroundDark' : ''}`}
              >
                {game.thumbnail_url ? (
                  <Image
                    src={game.thumbnail_url}
                    alt={game.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md border-2 border-foreground object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md border-2 border-foreground bg-white" />
                )}
                <div className="min-w-0">
                  <p className="clamp-custom-1 text-foreground-dark text-base font-semibold">
                    {game.name}
                  </p>
                  {game.min_players && game.max_players && (
                    <p className="text-sm text-foreground">
                      {game.min_players === game.max_players
                        ? `${game.max_players} Spieler*innen`
                        : `${game.min_players}-${game.max_players} Spieler*innen`}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
