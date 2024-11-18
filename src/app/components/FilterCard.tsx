"use client";

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
    <div className="">
      <div className="">
        <input
          type="text"
          placeholder="Nach Namen filtern..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="">Alle</option>
        <option value="alphaAsc">Name (A-Z)</option>
        <option value="alphaDesc">Name (Z-A)</option>
      </select>

      <div className="">
        <label>
          {" "}
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
          Nur verfügbare zeigen
        </label>
      </div>
    </div>
  );
};

export default FilterCard;
