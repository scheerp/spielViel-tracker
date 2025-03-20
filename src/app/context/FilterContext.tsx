import { ComplexityType } from '@lib/utils';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

export type FilterState = {
  filterText: string;
  showAvailableOnly: boolean;
  showMissingEanOnly: boolean;
  minPlayerCount: number;
  minAge: number;
  complexity: ComplexityType[];
};

export const defaultFilterState: FilterState = {
  filterText: '',
  showAvailableOnly: false,
  showMissingEanOnly: false,
  minPlayerCount: 0,
  minAge: 0,
  complexity: [] as ComplexityType[],
};

type FilterContextType = {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  isFilterActive: boolean;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<FilterState>(defaultFilterState);

  // Check if a filter is active
  const isFilterActive = useMemo(() => {
    return (
      filter.filterText !== defaultFilterState.filterText ||
      filter.showAvailableOnly !== defaultFilterState.showAvailableOnly ||
      filter.showMissingEanOnly !== defaultFilterState.showMissingEanOnly ||
      filter.minPlayerCount !== defaultFilterState.minPlayerCount ||
      filter.minAge !== defaultFilterState.minAge ||
      filter.complexity !== defaultFilterState.complexity
    );
  }, [filter]);

  return (
    <FilterContext.Provider value={{ filter, setFilter, isFilterActive }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
