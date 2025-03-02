'use client';

import { Game, PlayerSearch } from '@context/GamesContext';
import { useModal } from '@context/ModalContext';
import CreatePlayerSearch from './CreatePlayerSearch';

const PlayerSearches = ({
  playerSearches,
  game,
}: {
  playerSearches: PlayerSearch[];
  game: Game;
}) => {
  const { openModal } = useModal();
  if (playerSearches.length === 0) return null;
  return (
    <>
      <h3 className="m-8 mb-0 text-lg font-semibold">Mitspieler Gesucht:</h3>
      <div className="m-8 mt-4 rounded-xl border border-gray-300 bg-white p-4 shadow-md">
        <table className="w-full table-fixed border-collapse bg-white shadow-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">
                Mitspieler gesucht
              </th>
            </tr>
          </thead>
          <tbody>
            {playerSearches.map((playerSearch: PlayerSearch) => (
              <tr
                key={playerSearch.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">{playerSearch.name}</td>
                <td className="p-3 pl-6">{playerSearch.players_needed}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() =>
            openModal((loadingFromContext) => (
              <>
                <CreatePlayerSearch game={game} />
              </>
            ))
          }
          className="btn mt-4 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm"
        >
          Spieler suchen!
        </button>
      </div>
    </>
  );
};

export default PlayerSearches;
