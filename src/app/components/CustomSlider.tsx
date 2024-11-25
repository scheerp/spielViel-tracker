'use client';

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Slider } from '@mui/material';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#e01474',
    },
  },
});

type CustomSliderProps = {
  value: number[];
  minValue: number;
  maxValue: number;
  updateFunction: (value: number[]) => void;
  labelText: string;
};

const CustomSlider = ({
  value,
  minValue,
  maxValue,
  updateFunction,
  labelText,
}: CustomSliderProps) => {
  const [changeValue, setChangeValue] = React.useState<number[]>([
    minValue,
    maxValue,
  ]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    setChangeValue(newValue as number[]);
    updateFunction(changeValue);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <div className="relative mt-4 flex flex-col space-y-2">
        <label htmlFor="custom-slider">{labelText}</label>

        <Slider
          getAriaLabel={() => 'playercount range'}
          value={value}
          min={minValue}
          max={maxValue}
          defaultValue={[minValue, maxValue]}
          onChange={handleChange}
          valueLabelDisplay="off"
          disableSwap
          color="primary"
        />
      </div>
    </ThemeProvider>
  );
};

export default CustomSlider;
