'use client';

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import SearchIcon from '@icons/SearchIcon';
import { useFilter } from '@context/FilterContext';
import FilterIcon from '@icons/FilterIcon';
import Drawer from './Drawer';
import Filter from './Filter';
import LightbulbIcon from '@icons/LightbulbIcon';
import { useSession } from 'next-auth/react';
import SubHeader from './SubHeader';
import Clickable from './Clickable';

type SearchBarType = {
  editFamiliarity: boolean;
  setEditFamiliarity: Dispatch<SetStateAction<boolean>>;
};

const SearchBar: React.FC<SearchBarType> = ({
  editFamiliarity,
  setEditFamiliarity,
}) => {
  const { filter, isFilterActive, setFilter } = useFilter();
  const { data: session } = useSession();
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

    window.scrollTo({ top: 0 });
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(filter.filterText);
  }, [filter]);

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <SubHeader hasGradient={true}>
        <div className="mr-2 flex flex-grow items-center rounded-xl border-[3px] border-foreground bg-white px-3 shadow-darkBottom">
          <div className="relative flex w-full items-center py-1 pr-3">
            <SearchIcon
              tailwindColor="text-primary"
              className="ml-[0.1rem] mr-2 h-[1.7rem] w-[1.7rem]"
            />
            <input
              data-search="true"
              type="text"
              placeholder="Nach Namen filtern..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="mr-1 w-full border-0 bg-white py-1.5 pr-0 outline-none focus:ring-0"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {session && (
          <Clickable
            className={`mr-2 flex h-12 w-12 items-center justify-center ${editFamiliarity ? 'bg-primary' : 'bg-white'}`}
            onClick={() => setEditFamiliarity(!editFamiliarity)}
          >
            <LightbulbIcon
              tailwindColor={`${editFamiliarity ? 'text-white' : 'text-primary'}`}
              className="h-7 w-7"
            />
          </Clickable>
        )}
        <Clickable
          className={`flex h-12 w-12 items-center justify-center ${isFilterActive ? 'bg-primary' : 'bg-white'}`}
          onClick={toggleDrawer}
        >
          <FilterIcon
            tailwindColor={`${isFilterActive ? 'text-white' : 'text-primary'}`}
            className="h-6 w-6"
          />
        </Clickable>
      </SubHeader>

      <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
        <Filter closeDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};

export default SearchBar;
