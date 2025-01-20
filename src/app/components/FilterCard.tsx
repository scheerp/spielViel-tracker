'use client';

import React, { useEffect, useState } from 'react';
import SearcheIcon from '@icons/SearchIcon';
import CustomSlider from './CustomSlider';
import { useFilter } from '@context/FilterContext';

const FilterCard: React.FC = () => {
  const { filter, setFilter } = useFilter();
  const [searchTerm, setSearchTerm] = useState<string>(filter.filterText);
  const [sliderValue, setSliderValue] = useState<number>(filter.minPlayerCount);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter((prev) => ({ ...prev, filterText: searchTerm }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    setFilter((prev) => ({ ...prev, minPlayerCount: sliderValue }));
  }, [sliderValue]);

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleShowAvailableChange = (checked: boolean) => {
    setFilter((prev) => ({ ...prev, showAvailableOnly: checked }));
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  return (
    <div className="relative z-[1] mx-[1.6em] -mt-[10px] mb-4 flex flex-col justify-around rounded-xl bg-white p-[15px] pt-[10px] text-base shadow-md md:flex-row md:pt-[15px]">
      <div className="min-w-80 md:min-w-64 md:border-r-2">
        <div className="mb-15 flex items-center">
          <SearcheIcon tailwindColor="text-primary" className="mr-2 h-5 w-5" />
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Nach Namen filtern..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-80 border-0 py-2.5 pr-8 outline-none focus:ring-0 md:w-56"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-0 flex h-12 w-12 items-center justify-center rounded text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="available-only-checkbox" className="mt-2 flex">
            <input
              id="available-only-checkbox"
              type="checkbox"
              checked={filter.showAvailableOnly}
              onChange={(e) => handleShowAvailableChange(e.target.checked)}
              className="peer relative mr-2 mt-1 h-4 w-4 shrink-0 appearance-none rounded-sm border-[3px] border-primary bg-white checked:border-0 checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primaryLight focus:ring-offset-0 disabled:border-gray-400"
            />
            Nur verfügbare zeigen
          </label>
        </div>
      </div>
      <div className="md:ml-10 md:mr-2 md:min-w-60">
        <CustomSlider
          value={sliderValue}
          minValue={1}
          maxValue={10}
          updateFunction={handleSliderChange}
          labelText={(value) =>
            `Spielerzahl: ${value > 9 ? '10 und mehr' : value} Spieler`
          }
        />
      </div>
    </div>
  );
};

export default FilterCard;
