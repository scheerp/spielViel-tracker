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
import { useSession } from 'next-auth/react';
import ComplexityFilter from './ComplexityFilter';
import { ComplexityMapping, ComplexityType } from '@lib/utils';

type FilterProps = {
  closeDrawer: () => void;
};

const getComplexityKeys = (): ComplexityType[] | [] =>
  Object.keys(ComplexityMapping) as ComplexityType[] | [];

const Filter: React.FC<FilterProps> = ({ closeDrawer }) => {
  const { filter, setFilter } = useFilter();
  const { data: session } = useSession();
  const { totalCount } = useGames();
  const { showNotification } = useNotification();
  const [newTotalCount, setNewTotalCount] = useState<number>(totalCount);
  const [loclFilterState, setLocalFilterstate] = useState<FilterState>(filter);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGamesTotalCount = async () => {
    const queryParams = new URLSearchParams({
      show_available_only: String(loclFilterState.showAvailableOnly),
      show_missing_ean_only: String(loclFilterState.showMissingEanOnly),
      min_player_count: String(loclFilterState.minPlayerCount),
      player_age: String(loclFilterState.minAge),
      user_id: String(session?.user?.id ?? 0),
    });

    if (
      loclFilterState.complexity.length > 0 &&
      loclFilterState.complexity.length < Object.keys(ComplexityMapping).length
    ) {
      loclFilterState.complexity.forEach((complexity) => {
        queryParams.append('complexities', complexity);
      });
    }

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

  const handleComplexityFilterChange = (value: ComplexityType[] | []) => {
    setLocalFilterstate((prev) => ({
      ...prev,
      complexity: value.length === 0 ? [] : value,
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
        className="absolute left-2 top-4 mt-20 rounded-full bg-background px-3.5 py-2.5 font-bold text-gray-500 shadow-sm hover:text-gray-800"
        aria-label="Close modal"
      >
        filter löschen
      </button>

      <div className="mt-12 flex flex-col">
        <CustomSlider
          className="mt-4"
          value={loclFilterState.minPlayerCount}
          minValue={0}
          maxValue={10}
          updateFunction={handlePlayercountSliderChange}
          labelText={(value) =>
            value === 0
              ? 'Spieler*innenzahl: ungesetzt'
              : `Spieler*innenzahl: ${value > 9 ? '10 und mehr' : value} ${
                  value !== 1 ? 'Spieler*innen' : 'Spieler*in'
                }`
          }
        />

        <CustomSlider
          className="mt-4"
          value={loclFilterState.minAge}
          minValue={0}
          maxValue={18}
          updateFunction={handleAgeSliderChange}
          labelText={(value) =>
            value === 0 ? 'Alter: ungesetzt' : `Alter: ab ${value}`
          }
        />
        <ComplexityFilter
          complexityNames={getComplexityKeys()}
          updateFunction={handleComplexityFilterChange}
          selectedComplexities={loclFilterState.complexity}
        />
        <label htmlFor="available-only-checkbox" className="mt-6 flex">
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
        {session && (
          <label htmlFor="missing-ean-only-checkbox" className="mt-8 flex">
            <input
              id="missing-ean-only-checkbox"
              type="checkbox"
              checked={loclFilterState.showMissingEanOnly}
              onChange={(e) =>
                setLocalFilterstate({
                  ...loclFilterState,
                  showMissingEanOnly: e.target.checked,
                })
              }
              className="peer relative mr-2 mt-1 h-4 w-4 shrink-0 appearance-none rounded-sm border-[3px] border-primary bg-white checked:border-0 checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primaryLight focus:ring-offset-0 disabled:border-gray-400"
            />
            Nur Spiele ohne Barcode zeigen
          </label>
        )}
        <button
          className={`mt-10 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm transition-opacity ${loading && 'cursor-not-allowed opacity-20'}`}
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
