'use client';

import { useState, useEffect } from 'react';
import ComplexityPill from './ComplexityPill';
import { ComplexityType } from '@lib/utils';

type ComplexityFilterProps = {
  complexityNames: ComplexityType[];
  updateFunction: (selectedValues: ComplexityType[] | []) => void;
  selectedComplexities: ComplexityType[] | [];
};

const ComplexityFilter = ({
  complexityNames,
  updateFunction,
  selectedComplexities,
}: ComplexityFilterProps) => {
  const [activeComplexities, setActiveComplexities] =
    useState<ComplexityType[]>(selectedComplexities);

  useEffect(() => {
    setActiveComplexities(selectedComplexities);
  }, [selectedComplexities]);

  const handlePillClick = (complexityName: ComplexityType) => {
    const isSelected = activeComplexities.includes(complexityName);

    const updatedSelection = isSelected
      ? activeComplexities.filter((c) => c !== complexityName)
      : [...activeComplexities, complexityName];

    setActiveComplexities(updatedSelection);
    updateFunction(updatedSelection);
  };

  return (
    <>
      <label className="mt-6 flex">Komplexität:</label>
      <div className="flex flex-wrap justify-center pt-2">
        {complexityNames.map((complexityName) => {
          const isActive = activeComplexities.includes(complexityName);

          return (
            <button
              key={complexityName}
              className={`mx-0.5 mb-2 transition-opacity md:mx-1 md:mb-3 ${
                !isActive && 'opacity-50'
              }`}
              onClick={() => handlePillClick(complexityName)}
            >
              <ComplexityPill
                className="py-3"
                complexityName={complexityName}
              />
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ComplexityFilter;
