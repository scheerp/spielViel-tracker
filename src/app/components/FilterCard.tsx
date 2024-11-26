'use client';

import CustomSlider from './CustomSlider';
import SearcheIcon from './SearchIcon';

type FilterCardProps = {
  filterText: string;
  setFilterText: (text: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (checked: boolean) => void;
  playerCount: number[];
  setPlayerCount: (value: number[]) => void;
};

const FilterCard: React.FC<FilterCardProps> = ({
  filterText,
  setFilterText,
  showAvailableOnly,
  setShowAvailableOnly,
  playerCount,
  setPlayerCount,
}) => {
  return (
    <div className="relative z-[1] mx-[1.6em] -mt-[10px] mb-4 flex flex-col justify-around rounded-md bg-white p-[15px] pt-[10px] text-base shadow-md md:flex-row">
      <div className="min-w-80 md:min-w-64 md:border-r-2">
        <div className="mb-15 flex items-center">
          <SearcheIcon tailwindColor="text-primary" className="mr-2 h-5 w-5" />
          <input
            type="text"
            placeholder="Nach Namen filtern..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-40 border-0 py-2.5 outline-none focus:ring-0"
          />
        </div>
        <div className="flex items-center">
          <label className="mt-2 flex">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="peer relative mr-2 mt-1 h-4 w-4 shrink-0 appearance-none rounded-sm border-[3px] border-primary bg-white checked:border-0 checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primaryLight focus:ring-offset-0 disabled:border-gray-400"
            />
            Nur verfügbare zeigen
          </label>
        </div>
      </div>
      <div className="md:ml-10 md:min-w-60">
        <CustomSlider
          value={playerCount}
          minValue={1}
          maxValue={11}
          updateFunction={setPlayerCount}
          labelText={`Spielerzahl: ${playerCount[0]} bis ${playerCount[1] > 10 ? '10+' : playerCount[1]} Spieler`}
        />
      </div>
    </div>
  );
};

export default FilterCard;
