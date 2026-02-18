'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Clickable from './Clickable';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function PrimaryButton({
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}: PrimaryButtonProps) {
  const isDisabled = disabled;

  const baseStyles =
    'mt-10 bg-primary px-3 py-2.5 font-semibold text-white transition';

  return (
    <Clickable
      {...props}
      disabled={isDisabled}
      type={type}
      className={twMerge(
        baseStyles,
        isDisabled && 'cursor-not-allowed opacity-20',
        className,
      )}
    >
      {children}
    </Clickable>
  );
}
