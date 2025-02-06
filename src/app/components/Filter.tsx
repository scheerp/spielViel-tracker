'use client';

import {
  defaultFilterState,
  FilterState,
  useFilter,
} from '@context/FilterContext';
import CustomSlider from './CustomSlider';
import { useEffect, useState } from 'react';
import { useGames } from '@context/GamesContext';
import { AppError } from '../types/ApiError';
import { useNotification } from '@context/NotificationContext';

type FilterProps = {
  closeDrawer: () => void;
};

const Filter: React.FC<FilterProps> = ({ closeDrawer }) => {
  const { filter, setFilter } = useFilter();
  const { totalCount } = useGames();
  const { showNotification } = useNotification();
  const [newTotalCount, setNewTotalCount] = useState<number>(totalCount);
  const [loclFilterState, setLocalFilterstate] = useState<FilterState>(filter);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGamesTotalCount = async () => {
    const queryParams = new URLSearchParams({
      show_available_only: String(loclFilterState.showAvailableOnly),
      min_player_count: String(loclFilterState.minPlayerCount),
      player_age: String(loclFilterState.minAge),
    });

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/count?${queryParams.toString()}`,
      );
      const data = await response.json();

      setNewTotalCount(data.total_count);
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: `Fehler beim Laden verwandter Spiele: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesTotalCount();
  }, [loclFilterState]);

  const applyFilter = () => {
    setFilter((prev) => ({
      ...prev,
      ...loclFilterState,
    }));

    closeDrawer();
    window.scrollTo({ top: 0 });
  };

  const handlePlayercountSliderChange = (value: number) => {
    setLocalFilterstate((prev) => ({
      ...prev,
      ...loclFilterState,
      minPlayerCount: value,
    }));
  };

  const handleAgeSliderChange = (value: number) => {
    setLocalFilterstate((prev) => ({
      ...prev,
      ...loclFilterState,
      minAge: value,
    }));
  };

  const clearFilter = () => {
    closeDrawer();
    window.scrollTo({ top: 0 });
    setLocalFilterstate(defaultFilterState);
    setFilter(defaultFilterState);
  };

  return (
    <>
      <button
        onClick={clearFilter}
        className="absolute left-2 top-4 mt-20 rounded-full bg-background px-3.5 py-2.5 font-bold text-primary shadow-sm"
        aria-label="Close modal"
      >
        filter löschen
      </button>

      <div className="mt-12 flex flex-col">
        <CustomSlider
          value={loclFilterState.minPlayerCount}
          minValue={1}
          maxValue={10}
          updateFunction={handlePlayercountSliderChange}
          labelText={(value) =>
            `Spielerzahl: ${value > 9 ? '10 und mehr' : value} Spieler`
          }
        />

        <CustomSlider
          value={loclFilterState.minAge}
          minValue={5}
          maxValue={18}
          updateFunction={handleAgeSliderChange}
          labelText={(value) => `Alter: ab ${value}`}
        />

        <label htmlFor="available-only-checkbox" className="mt-8 flex">
          <input
            id="available-only-checkbox"
            type="checkbox"
            checked={loclFilterState.showAvailableOnly}
            onChange={(e) =>
              setLocalFilterstate({
                ...loclFilterState,
                showAvailableOnly: e.target.checked,
              })
            }
            className="peer relative mr-2 mt-1 h-4 w-4 shrink-0 appearance-none rounded-sm border-[3px] border-primary bg-white checked:border-0 checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primaryLight focus:ring-offset-0 disabled:border-gray-400"
          />
          Nur verfügbare zeigen
        </label>
        <button
          className={`mt-10 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm ${loading && 'cursor-not-allowed opacity-50'}`}
          onClick={applyFilter}
          disabled={loading}
        >
          {loading ? 'lädt...' : `${newTotalCount} Spiele anzeigen`}
        </button>
      </div>
    </>
  );
};

export default Filter;
