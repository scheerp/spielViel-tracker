'use client';

import { useEffect, useState } from 'react';
import Loading from './Loading';
import { Explainers, ExplainersResponse, Game } from '@context/GamesContext';
import CustomSlider from './CustomSlider';
import FamiliarityPill from './FamiliarityPill';
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';
import { FamiliarityValueMapping } from '@lib/utils';
import useUpdateGame from '@hooks/useUpdateGame';

type ExplainersProps = {
  game: Game;
};

const ExplainersList: React.FC<ExplainersProps> = ({ game }) => {
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
                      className="w-28"
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
        {session?.user?.username !== 'admin' &&
          session?.user?.username !== 'helper' && (
            <form onSubmit={(event) => event.preventDefault()} className="mt-4">
              <CustomSlider
                value={currentFamiliarity}
                labelText={(value) => (
                  <div className="mb-4">
                    Mein Erklärerstatus:{' '}
                    <FamiliarityPill
                      className="mt-2 py-1"
                      familiarity={value}
                    />
                  </div>
                )}
                minValue={0}
                maxValue={3}
                updateFunction={updateFamiliarity}
              />
            </form>
          )}
      </div>
    </div>
  );
};

export default ExplainersList;
