'use client';

import React, { forwardRef } from 'react';
import Clickable from './Clickable';
import { twMerge } from 'tailwind-merge';

type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { checked, defaultChecked, onChange, disabled, className, label, id },
    ref,
  ) => {
    return (
      <div className={twMerge('flex items-center gap-2', className)}>
        {/* Clickable nur um die Box */}
        <Clickable
          as="span"
          hasWhiteBorder={false}
          disabled={disabled}
          className="p-0"
        >
          <input
            id={id}
            type="checkbox"
            ref={ref}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className={`h-6 w-6 appearance-none rounded-lg bg-white transition duration-150 ease-in-out checked:bg-primary checked:text-white focus:outline-none`}
          />
          <span
            className={twMerge(
              'pointer-events-none absolute text-lg text-white transition-opacity duration-150',
              checked ? 'opacity-100' : 'opacity-0',
            )}
          >
            ✔
          </span>
        </Clickable>
        {label && <label htmlFor={id}>{label}</label>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
