'use client';

import { motion } from 'framer-motion';
import { Game } from '@context/GamesContext';
import Image from 'next/image';
import RotatedTitle from '@components/RotatedTitle';

type Props = {
  data?: Game[];
};

type RankedGame = Game & { rank: number };

const TopGamesSlide: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const MAX_PODIUM_HEIGHT = 260;

  const sorted = [...data]
    .sort((a, b) => b.borrows_count - a.borrows_count)
    .slice(0, 10);

  // Ranking mit Gleichständen
  const ranked: RankedGame[] = [];
  sorted.forEach((game, i) => {
    if (i === 0) {
      ranked.push({ ...game, rank: 1 });
      return;
    }
    const prev = sorted[i - 1];
    const prevRank = ranked[i - 1].rank;

    if (game.borrows_count === prev.borrows_count) {
      ranked.push({ ...game, rank: prevRank });
    } else {
      ranked.push({ ...game, rank: i + 1 });
    }
  });

  const max = Math.max(...sorted.map((g) => g.borrows_count));

  // Podest-Höhe proportional zur Ausleihzahl
  const getPodiumHeight = (count: number) => (count / max) * MAX_PODIUM_HEIGHT;

  // Zeige nur Top 5
  const top5 = ranked.slice(0, 5);

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden px-16 py-6">
      {/* TITLE */}
      <div className="col-span-2 flex justify-center">
        <RotatedTitle
          text="Top Spiele"
          tailwindBgColor="bg-error"
          className="mb-2"
        />
      </div>
      <span className="mb-8 mt-20 text-xl font-semibold">
        Diese Spiele wurden am häufigsten ausgeliehen.
      </span>

      {/* TOP 5 PODIUM */}
      <div className="flex w-full items-end justify-center gap-12">
        {top5.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="flex w-56 flex-col items-center text-center"
          >
            {game.rank === 1 && (
              <motion.div
                className="mb-2 text-4xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                👑
              </motion.div>
            )}

            <div className="mt-2 text-3xl font-bold text-gray-800">
              {game.borrows_count}
            </div>
            <div
              className={`mt-3 flex w-full items-end justify-center rounded-t-xl text-2xl font-bold text-white shadow-xl ${
                game.rank === 1
                  ? 'bg-yellow-400 shadow-yellow-300/70'
                  : 'bg-gray-400'
              }`}
              style={{ height: getPodiumHeight(game.borrows_count) }}
            ></div>
            <div className="mt-8 flex h-96 flex-col items-center justify-start">
              <div className="relative m-2 h-32 w-32 flex-shrink-0 overflow-hidden truncate rounded-lg border-[3px] border-foreground bg-white md:h-44 md:w-44">
                <Image
                  src={game.img_url || '/placeholder.png'}
                  alt={game.name}
                  priority
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div className="text-lg font-semibold leading-tight">
                {game.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopGamesSlide;
