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
import { useFeedback } from '@context/FeedbackContext';
import PrimaryButton from './PrimaryButton';
import Clickable from './Clickable';
import Checkbox from './Checkbox';

type FilterProps = {
  closeDrawer: () => void;
};

const getComplexityKeys = (): ComplexityType[] | [] =>
  Object.keys(ComplexityMapping) as ComplexityType[] | [];

const Filter: React.FC<FilterProps> = ({ closeDrawer }) => {
  const { filter, setFilter } = useFilter();
  const { data: session } = useSession();
  const { totalCount } = useGames();
  const { addInteraction } = useFeedback();
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
    addInteraction(2);
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
    addInteraction(2);
  };

  return (
    <>
      <Clickable
        onClick={clearFilter}
        className="absolute left-2 top-4 mt-20 bg-white px-3.5 py-2.5 font-semibold"
        aria-label="Close modal"
      >
        filter löschen
      </Clickable>

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
        <Checkbox
          id="available-only-checkbox"
          checked={loclFilterState.showAvailableOnly}
          onChange={(checked) =>
            setLocalFilterstate({
              ...loclFilterState,
              showAvailableOnly: checked,
            })
          }
          label="Nur verfügbare zeigen"
          className="mt-6"
        />
        {session && (
          <Checkbox
            id="missing-ean-only-checkbox"
            checked={loclFilterState.showMissingEanOnly}
            onChange={(checked) =>
              setLocalFilterstate({
                ...loclFilterState,
                showMissingEanOnly: checked,
              })
            }
            label="Nur Spiele ohne Barcode zeigen"
            className="mt-6"
          />
        )}
        <PrimaryButton onClick={applyFilter} disabled={loading}>
          {loading ? 'lädt...' : `${newTotalCount} Spiele anzeigen`}
        </PrimaryButton>
      </div>
    </>
  );
};

export default Filter;
