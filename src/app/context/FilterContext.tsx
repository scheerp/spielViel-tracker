import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FilterState = {
  filterText: string;
  showAvailableOnly: boolean;
  minPlayerCount: number;
};

const defaultFilterState: FilterState = {
  filterText: '',
  showAvailableOnly: false,
  minPlayerCount: 1,
};

type FilterContextType = {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<FilterState>(defaultFilterState);

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
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
