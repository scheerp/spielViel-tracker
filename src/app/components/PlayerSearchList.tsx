'use client';

import { Game, PlayerSearch } from '@context/GamesContext';
import { useModal } from '@context/ModalContext';
import { useSession } from 'next-auth/react';
import EditablePlayerSearch from './EditablePlayerSearch';

const PlayerSearchList = ({
  playerSearches,
  game,
  displayGame = false,
  onUpdateSuccess,
  onCreateSuccess,
}: {
  playerSearches: PlayerSearch[];
  game: Game;
  displayGame?: boolean;
  onUpdateSuccess?: (updatedPlayerSearch: PlayerSearch) => void;
  onCreateSuccess?: (updatedPlayerSearch: PlayerSearch) => void;
}) => {
  const { data: session } = useSession();
  const { openModal } = useModal();
  const now = new Date();
  const displayExpired =
    session?.user?.role === 'admin' || session?.user?.role === 'helper';

  const categorizePlayerSearches = (playerSearches: PlayerSearch[]) => {
    const valid = playerSearches.filter(
      (playerSearch) => new Date(playerSearch.expires_at) > now,
    );
    const expired = playerSearches.filter(
      (playerSearch) => new Date(playerSearch.expires_at) <= now,
    );

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

  const { valid, expired } = categorizePlayerSearches(playerSearches);

  if (valid.length === 0 && !displayExpired)
    return (
      <div className="flex w-full justify-center lg:mt-8">
        <button
          onClick={() =>
            openModal((loadingFromContext) => (
              <EditablePlayerSearch game={game} onSuccess={onCreateSuccess} />
            ))
          }
          className="m-4 w-52 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm"
        >
          Mitspieler suchen!
        </button>
      </div>
    );

  return (
    <>
      <h3 className="m-4 self-start text-lg font-semibold md:m-8 md:mb-4">
        Mitspieler Gesucht:
      </h3>
      <div className="bg-whiteshadow-md m-4 mb-12 mt-0 flex flex-col items-center rounded-xl bg-white p-4 shadow-md md:m-8 md:mt-0">
        <p className="mb-4 self-start text-sm text-gray-500">
          Hier findest du Leute die bereits nach Mitspielern suchen:
        </p>
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b-2 border-gray-300">
              <th className="p-3 text-left font-semibold">Name</th>
              {displayGame && (
                <th className="p-3 text-left font-semibold">Spiel</th>
              )}
              <th className="p-3 text-left font-semibold">gesucht</th>
            </tr>
          </thead>
          <tbody className="mx-2">
            {valid.map((playerSearch: PlayerSearch) => {
              return (
                <tr
                  onClick={() =>
                    openModal((loadingFromContext) => (
                      <>
                        <EditablePlayerSearch
                          game={game}
                          playerSearch={playerSearch}
                          onSuccess={
                            playerSearch.can_edit ? onUpdateSuccess : undefined
                          }
                          mode={playerSearch.can_edit ? 'edit' : 'view'}
                        />
                      </>
                    ))
                  }
                  key={playerSearch.id}
                  className={`border-t border-gray-200 hover:bg-gray-50 ${playerSearch.can_edit && 'font-semibold'}`}
                >
                  <td className="flex items-center">
                    <span className="clamp-custom break-words p-3 leading-tight">
                      {playerSearch.name}
                    </span>
                  </td>
                  {displayGame && <td className="p-3">{game.name}</td>}
                  <td className="p-3">{playerSearch.players_needed} Spieler</td>
                </tr>
              );
            })}
            {displayExpired &&
              expired.map((playerSearch: PlayerSearch) => {
                return (
                  <tr
                    key={playerSearch.id}
                    className={`border-t border-gray-200 text-gray-400 hover:bg-gray-50 ${playerSearch.can_edit && 'font-semibold'}`}
                  >
                    <td className="flex items-center p-3">
                      <span className="clamp-custom align-center break-words leading-tight">
                        {playerSearch.name}
                      </span>
                    </td>
                    {displayGame && <td className="p-3">{game.name}</td>}
                    <td className="p-3">
                      {playerSearch.players_needed} Spieler
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <button
          onClick={() =>
            openModal((loadingFromContext) => (
              <>
                <EditablePlayerSearch
                  game={game}
                  mode={'create'}
                  onSuccess={onCreateSuccess}
                />
              </>
            ))
          }
          className="m-4 mb-0 w-56 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm"
        >
          Mitspieler suchen!
        </button>
      </div>
    </>
  );
};

export default PlayerSearchList;
