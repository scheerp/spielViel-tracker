'use client';

import SearcheIcon from './SearchIcon';

type FilterCardProps = {
  filterText: string;
  setFilterText: (text: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (checked: boolean) => void;
};

const FilterCard: React.FC<FilterCardProps> = ({
  filterText,
  setFilterText,
  sortOption,
  setSortOption,
  showAvailableOnly,
  setShowAvailableOnly,
}) => {
  return (
    <div className="relative z-[1] mx-[1.6em] -mt-[10px] mb-4 flex flex-col justify-around rounded-md bg-white p-[15px] pt-[10px] text-base shadow-md">
      <div className="mb-15 flex items-center">
        <SearcheIcon tailwindColor="text-primary" className="mr-2 h-5 w-5" />
        <input
          type="text"
          placeholder="Nach Namen filtern..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border-0 py-2.5 outline-none focus:ring-0"
        />
      </div>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="mb-1 rounded-[1px] border-0 py-2.5 outline-none focus:ring-0"
      >
        <option value="alphaAsc">Name (A-Z)</option>
        <option value="alphaDesc">Name (Z-A)</option>
      </select>

      <div className="flex items-center">
        <label className="mt-2 flex">
          {' '}
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
            className="focus:ring-primaryLight peer relative mr-2 mt-1 h-4 w-4 shrink-0 appearance-none rounded-sm border-[3px] border-primary bg-white checked:border-0 checked:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:border-gray-400"
          />
          Nur verfügbare zeigen
        </label>
      </div>
    </div>
  );
};

export default FilterCard;
