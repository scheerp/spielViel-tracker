'use client';

import { Game } from '@context/GamesContext';

const TopGamesSlide: React.FC<{ data?: Game[] }> = ({ data }) => {
  return (
    <div className="mx-auto mb-3 p-6">
      <h2 className="mb-6 text-2xl font-bold">Statistik</h2>
      <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-md">
        <table className="w-full table-fixed border-collapse bg-white shadow-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">geliehen</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((game: Game) => (
              <tr
                key={game.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">{game.name}</td>
                <td className="p-3 pl-6">{game.borrow_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopGamesSlide;
