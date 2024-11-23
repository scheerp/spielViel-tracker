import React from 'react';

type CustomSliderProps = {
  value: number;
  minValue: number;
  maxValue: number;
  updateFunction: (value: number) => void;
  labelText: string;
};

const CustomSlider = ({
  value,
  minValue,
  maxValue,
  updateFunction,
  labelText,
}: CustomSliderProps) => {
  return (
    <div className="relative mt-4 flex flex-col space-y-2">
      <label htmlFor="custom-slider">{labelText}</label>

      <input
        id="custom-slider"
        type="range"
        value={value}
        min={minValue}
        max={maxValue}
        onChange={(e) => updateFunction(parseInt(e.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primaryLight hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryLight"
      />
    </div>
  );
};

export default CustomSlider;
