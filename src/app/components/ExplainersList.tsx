'use client';

import { useEffect, useState } from 'react';
import Loading from './Loading';
import { Explainers, ExplainersResponse, Game } from '@context/GamesContext';
import CustomSlider from './CustomSlider';
import FamiliarityPill from './FamiliarityPill';
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';
import { FamiliarityMapping, FamiliarityValueMapping } from '@lib/utils';
import useUpdateGame from '@hooks/useUpdateGame';
import ThumbIcon from '@icons/ThumbIcon';

type ExplainersProps = {
  game: Game;
  displaySlider?: boolean;
};

const ExplainersList: React.FC<ExplainersProps> = ({
  game,
  displaySlider = true,
}) => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const { updateGame } = useUpdateGame();
  const [currentFamiliarity, setCurrentFamiliarity] = useState<number>(0);
  const [explainers, setExplainers] = useState<Explainers[]>([]);
  const [initailLoad, setInitialLoad] = useState<boolean>(true);

  const userId = session?.user?.id;

  useEffect(() => {
    fetchExplainers();
  }, [currentFamiliarity]);

  const fetchExplainers = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/helper/${game.id}/explainers?game_id=${game.id}&user_id=${session?.user?.id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const data: ExplainersResponse = await response.json();
      if (initailLoad) {
        setCurrentFamiliarity(data.my_familiarity ?? 0);
      }
      setExplainers(data.explainers);
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: `Fehler: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setInitialLoad(false);
    }
  };

  const updateFamiliarity = async (value: number) => {
    if (value === currentFamiliarity) return;

    await updateGame({
      game,
      operation: 'updateFamiliarity',
      familiarity: value,
    });

    setCurrentFamiliarity(value);
  };

  if (initailLoad) {
    return <Loading />;
  }

  return (
    <div className="fixed mt-8 flex h-[80vh] w-[78vw] items-center justify-center md:w-[95%]">
      <div className="flex h-full w-full flex-col bg-white pb-4 md:w-[70%] md:pb-16">
        <div className="flex-grow overflow-y-auto">
          <h2 className="mb-4 text-lg font-semibold">Erklärer:</h2>
          <div className="mx-6">
            {explainers && explainers.length > 0 ? (
              explainers.map((group) => (
                <div
                  key={group.familiarity}
                  className="mb-6 border-b border-gray-300"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <FamiliarityPill
                      familiarity={group.familiarity}
                      className="mt-2 w-36 py-1 text-lg font-semibold"
                    />
                    :
                  </div>
                  <div className="mb-6 pl-2">
                    <ul
                      className={`space-y-2 border-l-4 ${FamiliarityValueMapping[group.familiarity].border}`}
                    >
                      {group.users.map((user) => (
                        <li
                          key={user.id}
                          className="my-4 mb-2 flex items-center space-x-3 p-2 hover:bg-gray-50"
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 ${user.id === Number(userId) && 'bg-primary text-white'}`}
                          >
                            <span className="text-md font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span
                            className={`text-base ${user.id === Number(userId) && 'font-bold'}`}
                          >
                            {user.username}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Keine Erklärer verfügbar.</p>
            )}
          </div>
        </div>
        {displaySlider &&
          session?.user?.username !== 'admin' &&
          session?.user?.username !== 'helper' && (
            <div className="flex flex-col items-center justify-center pl-3">
              <p className="text-md mb-4 text-gray-500 md:block">
                Wie gut kannst du das Spiel erklären?
              </p>

              <div className="flex w-full max-w-80 items-center justify-around">
                <button
                  onClick={() => updateFamiliarity(1)}
                  className={`flex items-center justify-center rounded-full transition-all duration-300 ${FamiliarityMapping.UNKNOWN.color} ${currentFamiliarity !== 1 && 'opacity-50'}`}
                >
                  <ThumbIcon
                    className={`m-4 h-10 w-10 rotate-180 md:h-12 md:w-12`}
                  />
                </button>
                <button
                  onClick={() => updateFamiliarity(2)}
                  className={`items-center justify-center rounded-full transition-all duration-300 ${FamiliarityMapping.NEULING.color} ${currentFamiliarity !== 2 && 'opacity-50'}`}
                >
                  <ThumbIcon className="h-13 w-13 m-3 rotate-90 md:h-12 md:w-12" />
                </button>
                <button
                  onClick={() => updateFamiliarity(3)}
                  className={`items-center justify-center rounded-full transition-all duration-300 ${FamiliarityMapping.PROFI.color} ${currentFamiliarity !== 3 && 'opacity-50'}`}
                >
                  <ThumbIcon className="h-13 w-13 m-3 md:h-12 md:w-12" />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ExplainersList;
