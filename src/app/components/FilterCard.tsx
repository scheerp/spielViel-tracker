'use client';

import SearcheIcon from '@icons/SearchIcon';
import CustomSlider from './CustomSlider';

type FilterCardProps = {
  filterText: string;
  setFilterText: (text: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (checked: boolean) => void;
  minPlayerCount: number;
  setMinPlayerCount: (value: number) => void;
};

const FilterCard: React.FC<FilterCardProps> = ({
  filterText,
  setFilterText,
  showAvailableOnly,
  setShowAvailableOnly,
  minPlayerCount,
  setMinPlayerCount,
}) => {
  return (
    <div className="relative z-[1] mx-[1.6em] -mt-[10px] mb-4 flex flex-col justify-around rounded-xl bg-white p-[15px] pt-[10px] text-base shadow-md md:flex-row md:pt-[15px]">
      <div className="min-w-80 md:min-w-64 md:border-r-2">
        <div className="mb-15 flex items-center">
          <SearcheIcon tailwindColor="text-primary" className="mr-2 h-5 w-5" />
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Nach Namen filtern..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-80 border-0 py-2.5 pr-8 outline-none focus:ring-0 md:w-56"
            />
            {filterText && (
              <button
                onClick={() => setFilterText('')}
                className="absolute right-1 flex h-12 w-12 items-center justify-center rounded text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white md:right-3"
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
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="peer relative mr-2 mt-1 h-4 w-4 shrink-0 appearance-none rounded-sm border-[3px] border-primary bg-white checked:border-0 checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primaryLight focus:ring-offset-0 disabled:border-gray-400"
            />
            Nur verfügbare zeigen
          </label>
        </div>
      </div>
      <div className="md:ml-10 md:mr-2 md:min-w-60">
        <CustomSlider
          value={minPlayerCount}
          minValue={1}
          maxValue={10}
          updateFunction={setMinPlayerCount}
          labelText={`min Spielerzahl: ${minPlayerCount > 10 ? '10+' : minPlayerCount} Spieler`}
        />
      </div>
    </div>
  );
};

export default FilterCard;
