'use client';

import { Game, PlayerSearch } from '@context/GamesContext';
import { useModal } from '@context/ModalContext';
import { useSession } from 'next-auth/react';
import EditablePlayerSearch from './EditablePlayerSearch';
import SearchIcon from '@icons/SearchIcon';
import TrashIcon from '@icons/TrashIcon';
import Loading from './Loading';
import { AppError } from '../types/ApiError';
import { useNotification } from '@context/NotificationContext';
import Image from 'next/image';
import AddSearchIcon from '@icons/AddSearchIcon';
import { categorizePlayerSearches, timeSinceMinutes } from '@lib/utils';
import PrimaryButton from './PrimaryButton';
import Clickable from './Clickable';

export type PlayerSearchGameSummary = Pick<
  Game,
  | 'id'
  | 'name'
  | 'img_url'
  | 'thumbnail_url'
  | 'max_players'
  | 'min_players'
  | 'min_playtime'
  | 'max_playtime'
  | 'best_playercount'
  | 'complexity_label'
  | 'player_age'
>;

interface PlayerSearchTableProps {
  playerSearches: PlayerSearch[];
  game: PlayerSearchGameSummary;
  displayGame?: boolean;
  tableDescription?: string;
  tableTitle?: React.ReactNode;
  allowCreate?: boolean;
  onUpdateSuccess?: (updatedPlayerSearch: PlayerSearch) => void;
  onCreateSuccess?: (updatedPlayerSearch: PlayerSearch) => void;
  onDeleteSuccess?: (updatedPlayerSearch: PlayerSearch) => void;
}

const PlayerSearchTable = ({
  playerSearches,
  game,
  displayGame = false,
  tableDescription,
  tableTitle,
  allowCreate = true,
  onUpdateSuccess,
  onCreateSuccess,
  onDeleteSuccess,
}: PlayerSearchTableProps) => {
  const { data: session } = useSession();
  const { openModal, closeModal } = useModal();
  const { showNotification } = useNotification();
  const displayExpired =
    session?.user?.role === 'admin' || session?.user?.role === 'helper';

  const { valid, expired } = categorizePlayerSearches(playerSearches);

  const deletePlayerSearch = async (playerSearch: PlayerSearch) => {
    const queryParams = new URLSearchParams({
      edit_token: String(playerSearch.edit_token),
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/player_search/${playerSearch.id}?${queryParams.toString()}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const responseData = await response.json();

      showNotification({
        message: (
          <div className="flex items-center">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
              <Image
                src={
                  game.thumbnail_url ? game.thumbnail_url : '/placeholder.png'
                }
                alt={game.name}
                priority
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <span className="ml-4">
              {`Spieler*innensuche für ${game.name} erfolgreich gelöscht!`}
            </span>
          </div>
        ),
        type: 'success',
        duration: 2500,
      });

      closeModal();

      if (onDeleteSuccess) {
        onDeleteSuccess(playerSearch);
      }

      const storedTokens = JSON.parse(
        localStorage.getItem('edit_tokens') || '[]',
      );
      storedTokens.push(responseData.edit_token);
      localStorage.setItem('edit_tokens', JSON.stringify(storedTokens));
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: `Fehler: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    }
  };

  if (valid.length === 0 && expired.length === 0 && allowCreate)
    return (
      <div className="flex w-full justify-center lg:mt-8">
        <PrimaryButton
          className="mb-8 mt-4"
          onClick={() =>
            openModal((loadingFromContext) => (
              <EditablePlayerSearch
                game={game}
                onSuccess={onCreateSuccess}
                mode={'create'}
              />
            ))
          }
        >
          Mitspieler*innen suchen!
        </PrimaryButton>
      </div>
    );

  return (
    <>
      <div className="mb-12 mt-0 flex flex-col items-center rounded-xl border-[3px] border-foreground bg-backgroundDark p-4 md:m-8 md:mt-0">
        {tableTitle && (
          <h3 className="self-start text-lg font-semibold md:mb-4 md:mt-2">
            {tableTitle}
          </h3>
        )}
        {tableDescription && (
          <p className="mb-4 self-start text-sm text-gray-500">
            {tableDescription}
          </p>
        )}
        <table className="w-full table-fixed border-collapse rounded-xl">
          <thead className="bg-backgroundDark">
            <tr className="border-b-2 border-foreground">
              <th className="p-3 text-left font-semibold">Name</th>
              {displayGame && (
                <th className="p-3 text-left font-semibold">Spiel</th>
              )}
              <th className="p-3 text-left font-semibold">Gesucht</th>
              <th className="hidden p-3 text-left font-semibold md:table-cell">
                Details
              </th>
              <th className="hidden p-3 text-left font-semibold md:table-cell">
                Suche seit
              </th>
              <th className="w-[6.5rem] p-3 text-center font-semibold md:w-28">
                Aktion
              </th>
            </tr>
          </thead>
          <tbody className="mx-2">
            {valid.map((playerSearch: PlayerSearch) => {
              return (
                <tr
                  key={playerSearch.id}
                  className={`border-t border-gray-200 hover:bg-gray-50 ${playerSearch.can_edit && 'font-semibold'}`}
                >
                  <td className="p-3">
                    <span className="clamp-custom-2 flex items-center break-words leading-tight">
                      {playerSearch.name}
                    </span>
                  </td>
                  {displayGame && <td className="p-3">{game.name}</td>}
                  <td className="p-3">
                    {playerSearch.players_needed}{' '}
                    {playerSearch.players_needed > 1 ? 'Personen' : 'Person'}
                  </td>
                  <td className="hidden p-3 align-middle md:table-cell">
                    <span className="clamp-custom-2 block break-words leading-tight">
                      {playerSearch.details}
                    </span>
                  </td>
                  <td className="hidden p-3 align-middle md:table-cell">
                    <span className="clamp-custom-2 block break-words leading-tight">
                      {timeSinceMinutes(playerSearch.created_at)}
                    </span>
                  </td>
                  <td className="flex justify-around p-3 px-0">
                    <Clickable
                      onClick={() =>
                        openModal((loadingFromContext) => (
                          <>
                            <EditablePlayerSearch
                              game={game}
                              playerSearch={playerSearch}
                              onSuccess={
                                playerSearch.can_edit
                                  ? onUpdateSuccess
                                  : undefined
                              }
                              mode={playerSearch.can_edit ? 'edit' : 'view'}
                            />
                          </>
                        ))
                      }
                      className="mb-2 bg-status p-3 text-white"
                    >
                      {playerSearch.can_edit ? (
                        <AddSearchIcon
                          tailwindColor="text-white"
                          className="h-6 w-6"
                        />
                      ) : (
                        <SearchIcon
                          tailwindColor="text-white"
                          className="h-6 w-6"
                        />
                      )}
                    </Clickable>
                    {playerSearch.can_edit && playerSearch.edit_token && (
                      <Clickable
                        onClick={() =>
                          openModal((loadingFromContext) => (
                            <div className="mt-6 flex flex-col justify-center text-center md:justify-start">
                              Möchtest du deine Mitsielersuche für{' '}
                              <b>{game.name}</b> wirklich löschen? wirklich
                              löschen?
                              <PrimaryButton
                                onClick={() => deletePlayerSearch(playerSearch)}
                                disabled={loadingFromContext}
                                className={`btn mt-6 px-3 py-2.5 font-semibold ${
                                  loadingFromContext
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                                }`}
                              >
                                löschen!
                              </PrimaryButton>
                              {loadingFromContext && <Loading />}
                            </div>
                          ))
                        }
                        className="mb-2 ml-2 bg-error p-3 text-white"
                      >
                        <TrashIcon
                          tailwindColor="text-white"
                          className="h-6 w-6"
                        />
                      </Clickable>
                    )}
                  </td>
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
                      <span className="clamp-custom-2 align-center break-words leading-tight">
                        {playerSearch.name}
                      </span>
                    </td>
                    {displayGame && <td className="p-3">{game.name}</td>}
                    <td className="p-3">
                      {playerSearch.players_needed}{' '}
                      {playerSearch.players_needed > 1 ? 'Personen' : 'Person'}
                    </td>
                    <td className="hidden items-center p-3 md:flex">
                      <span className="clamp-custom-2 flex break-words leading-tight">
                        {playerSearch.details}
                      </span>
                    </td>
                    <td className="hidden items-center p-3 pt-3 md:table-cell"></td>
                    <td className="hidden items-center p-3 pt-3 md:table-cell"></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {allowCreate && (
          <PrimaryButton
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
          >
            Mitspieler*innen suchen!
          </PrimaryButton>
        )}
      </div>
    </>
  );
};

export default PlayerSearchTable;
