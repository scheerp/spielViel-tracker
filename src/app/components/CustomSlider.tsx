import React, { useState, useEffect } from 'react';

type CustomSliderProps = {
  value: number;
  minValue: number;
  maxValue: number;
  disabled?: boolean;
  className?: string;
  updateFunction: (value: number) => void;
  labelText?: (value: number) => React.ReactNode;
};

const CustomSlider = ({
  value,
  minValue,
  maxValue,
  disabled = false,
  className,
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
    <div className={`relative flex flex-col space-y-2 ${className}`}>
      {labelText && (
        <label htmlFor="custom-slider">{labelText(tempValue)}</label>
      )}
      <input
        id="custom-slider"
        type="range"
        value={tempValue}
        min={minValue}
        max={maxValue}
        disabled={disabled}
        onChange={handleSliderChange}
        onMouseUp={handleMouseUpOrTouchEnd}
        onTouchEnd={handleMouseUpOrTouchEnd}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primaryLight hover:bg-gray-300 focus:outline-none"
      />
    </div>
  );
};

export default CustomSlider;
