'use client';

import { useEffect, useState } from 'react';
import Loading from './Loading';
import { Explainers, ExplainersResponse } from '@context/GamesContext';
import CustomSlider from './CustomSlider';
import FamiliarityPill from './FamiliarityPill';
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';
import { FamiliarityValueMapping } from '@lib/utils';

type ExplainersProps = {
  gameId: number;
};

const ExplainersList: React.FC<ExplainersProps> = ({ gameId }) => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [currentFamiliarity, setCurrentFamiliarity] = useState<number>(0);
  const [explainers, setExplainers] = useState<Explainers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [initailLoad, setInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    fetchExplainers();
    setInitialLoad(false);
  }, []);

  const fetchExplainers = async () => {
    setLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/helper/${gameId}/explainers?game_id=${gameId}&user_id=${session?.user?.id}`;
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
      if (currentFamiliarity === null) {
        setCurrentFamiliarity(data.my_familiarity);
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
      setLoading(false);
    }
  };

  const updateFamiliarity = async (value: number) => {
    if (value === currentFamiliarity) return;

    setCurrentFamiliarity(value);
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/helper/${gameId}/familiarity`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            game_id: gameId,
            familiarity: value,
            user_id: session?.user?.id,
          }),
        },
      );
      if (!response.ok) {
        console.error('Error updating familiarity', await response.json());
      } else {
        await response.json();
        await fetchExplainers();
        const familiarityLabel = FamiliarityValueMapping[value].label;
        showNotification({
          message: (
            <div>
              Erklärerstatus erfolgreich aktualisiert:
              <br />
              {familiarityLabel}
            </div>
          ),
          type: 'success',
          duration: 2500,
        });
      }
    } catch (error) {
      console.error('Error updating familiarity:', error);

      showNotification({
        message: <div>Fehler beim aktualisieren </div>,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initailLoad) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-16 mt-12 flex items-center justify-center">
      <div className="flex h-full w-full flex-col bg-white pb-10 md:w-[70%] md:pb-16">
        {/* Header (optional) */}
        <h1 className="mb-4 text-xl font-semibold">Erklärer:</h1>

        {/* Scrollbarer Content-Bereich */}
        <div className="flex-grow overflow-y-auto">
          {explainers && explainers.length > 0 ? (
            explainers.map((group) => (
              <div
                key={group.familiarity}
                className="mb-6 border-b border-gray-300"
              >
                <div className="mb-2 flex items-center gap-2">
                  <FamiliarityPill familiarity={group.familiarity} />:
                </div>
                <ul className="space-y-2">
                  {group.users.map((user) => (
                    <li
                      key={user.id}
                      className="my-4 mb-2 flex items-center space-x-3 p-2 hover:bg-gray-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-base">{user.username}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-center">Keine Erklärer verfügbar.</p>
          )}
        </div>

        {/* Formular immer am unteren Rand */}
        <form onSubmit={(event) => event.preventDefault()} className="mt-4">
          <CustomSlider
            value={currentFamiliarity}
            labelText={(value) => (
              <div className="mb-4">
                Mein Erklärerstatus:{' '}
                <FamiliarityPill className="mt-2" familiarity={value} />
              </div>
            )}
            minValue={0}
            maxValue={3}
            updateFunction={updateFamiliarity}
          />
        </form>
      </div>
    </div>
  );
};

export default ExplainersList;
