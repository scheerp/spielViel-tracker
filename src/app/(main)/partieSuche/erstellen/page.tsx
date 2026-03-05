'use client';

import EditablePlayerSearch from '@components/EditablePlayerSearch';
import GameSearchSelect, {
  GameSearchResult,
} from '@components/GameSearchResult';
import { useState } from 'react';
import { PlayerSearchGameSummary } from '@components/PlayerSearchTable';
import Image from 'next/image';
import ComplexityPill from '@components/ComplexityPill';

const validComplexityLabels = [
  'Family',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
] as const;

const toComplexityLabel = (value?: string | null) =>
  validComplexityLabels.find((label) => label === value);

export default function MitspielersuchePage() {
  const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(
    null,
  );

  const selectedGameSummary: PlayerSearchGameSummary | null = selectedGame
    ? {
        id: selectedGame.id,
        name: selectedGame.name,
        img_url: selectedGame.img_url || selectedGame.thumbnail_url || '',
        thumbnail_url: selectedGame.thumbnail_url || selectedGame.img_url || '',
        max_players: selectedGame.max_players ?? 10,
        min_players: selectedGame.min_players ?? 1,
        min_playtime: selectedGame.min_playtime ?? 0,
        max_playtime: selectedGame.max_playtime ?? 0,
        best_playercount: selectedGame.best_playercount ?? undefined,
        complexity_label: toComplexityLabel(selectedGame.complexity_label),
        player_age: selectedGame.player_age ?? 0,
      }
    : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-6">
      <h1 className="text-foreground-dark mb-6 text-3xl font-bold md:text-4xl">
        Mitspieler suchen
      </h1>

      {!selectedGame ? (
        <div className="rounded-2xl border-[3px] border-foreground bg-backgroundDark p-4 shadow-darkBottom md:p-6">
          <p className="text-foreground-dark mb-3 text-base font-medium">
            Spiel auswählen
          </p>
          <GameSearchSelect onSelect={setSelectedGame} />
        </div>
      ) : (
        <div className="rounded-2xl border-[3px] border-foreground bg-white p-4 shadow-darkBottom md:p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-foreground-dark text-lg font-semibold">
              Ausgewähltes Spiel
            </h2>
            <button
              type="button"
              onClick={() => setSelectedGame(null)}
              className="text-foreground-dark rounded-xl border-[3px] border-foreground bg-background px-3 py-1.5 text-sm font-semibold transition hover:bg-backgroundDark"
            >
              Spiel wechseln
            </button>
          </div>

          <div className="mt-3 grid gap-4 md:grid-cols-[88px_1fr] md:items-start">
            <div className="relative h-[88px] w-[88px] overflow-hidden rounded-lg border-[3px] border-foreground bg-background">
              <Image
                src={
                  selectedGame.thumbnail_url ||
                  selectedGame.img_url ||
                  '/placeholder.png'
                }
                alt={selectedGame.name}
                fill
                sizes="88px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-xl font-bold text-primary">
                {selectedGame.name}
              </p>

              <div className="text-foreground-dark mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {selectedGame.min_players && selectedGame.max_players && (
                  <span>
                    {selectedGame.min_players === selectedGame.max_players
                      ? `${selectedGame.max_players} Spieler*innen`
                      : `${selectedGame.min_players}-${selectedGame.max_players} Spieler*innen`}
                  </span>
                )}
                {selectedGame.min_playtime && selectedGame.max_playtime && (
                  <span>
                    {selectedGame.min_playtime === selectedGame.max_playtime
                      ? `${selectedGame.max_playtime} Min`
                      : `${selectedGame.min_playtime}-${selectedGame.max_playtime} Min`}
                  </span>
                )}
                {selectedGame.player_age && (
                  <span>{selectedGame.player_age}+</span>
                )}
              </div>

              <ComplexityPill
                complexityName={toComplexityLabel(
                  selectedGame.complexity_label,
                )}
                className="mt-3 py-1"
              />
            </div>
          </div>
        </div>
      )}

      {selectedGameSummary && (
        <div className="mt-6 rounded-2xl border-[3px] border-foreground bg-backgroundDark p-4 shadow-darkBottom md:p-6">
          <EditablePlayerSearch
            key={selectedGameSummary.id}
            game={selectedGameSummary}
            mode="create"
          />
        </div>
      )}
    </div>
  );
}
