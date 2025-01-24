'use client';

import React, { useState, useEffect } from 'react';
import SearcheIcon from '@icons/SearchIcon';
import { useFilter } from '@context/FilterContext';
import FilterIcon from '@icons/FilterIcon';
import Drawer from './Drawer';
import Filter from './Filter';

const SearchBar: React.FC = () => {
  const { filter, isFilterActive, setFilter } = useFilter();
  const [searchTerm, setSearchTerm] = useState<string>(filter.filterText);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (searchTerm === '') {
      setFilter((prev) => ({ ...prev, filterText: searchTerm }));
      return;
    }
    const timeout = setTimeout(() => {
      setFilter((prev) => ({ ...prev, filterText: searchTerm }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const filterStyles =
    'flex h-12 w-12 items-center justify-center rounded-full' +
    (isFilterActive ? 'bg-primary' : 'bg-white');

  return (
    <>
      <div className="fixed z-20 mb-4 flex h-20 w-full bg-background px-2 py-4 md:min-w-64">
        <div className="mr-2 flex flex-grow items-center rounded-full bg-white px-3">
          <div className="relative flex w-full items-center pr-3">
            <SearcheIcon
              tailwindColor="text-primary"
              className="mr-2 h-5 w-5"
            />
            <input
              type="text"
              placeholder="Nach Namen filtern..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="mr-1 w-full border-0 py-2.5 pr-0 outline-none focus:ring-0"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <button
          className={`flex h-12 w-12 items-center justify-center rounded-full ${isFilterActive ? 'bg-primary' : 'bg-white'}`}
          onClick={toggleDrawer}
        >
          <FilterIcon
            tailwindColor={`${isFilterActive ? 'text-white' : 'text-primary'}`}
            className="h-6 w-6"
          />
        </button>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
        <Filter closeDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};

export default SearchBar;
