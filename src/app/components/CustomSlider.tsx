import React, { useState, useEffect } from 'react';

type CustomSliderProps = {
  value: number;
  minValue: number;
  maxValue: number;
  updateFunction: (value: number) => void;
  labelText?: (value: number) => React.ReactNode;
};

const CustomSlider = ({
  value,
  minValue,
  maxValue,
  updateFunction,
  labelText,
}: CustomSliderProps) => {
  const [tempValue, setTempValue] = useState<number>(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(parseInt(e.target.value, 10));
  };

  const handleMouseUpOrTouchEnd = () => {
    updateFunction(tempValue);
  };

  return (
    <div className="relative mt-4 flex flex-col space-y-2">
      {labelText && (
        <label htmlFor="custom-slider">{labelText(tempValue)}</label>
      )}
      <input
        id="custom-slider"
        type="range"
        value={tempValue}
        min={minValue}
        max={maxValue}
        onChange={handleSliderChange}
        onMouseUp={handleMouseUpOrTouchEnd}
        onTouchEnd={handleMouseUpOrTouchEnd}
        className="h-3 w-full cursor-pointer appearance-none rounded-xl bg-gray-200 accent-primaryLight hover:bg-gray-300 focus:outline-none"
      />
    </div>
  );
};

export default CustomSlider;
