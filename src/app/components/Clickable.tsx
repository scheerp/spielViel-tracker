'use client';

import React, { ElementType, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ClickableOwnProps = {
  hasWhiteBorder?: boolean;
  disabled?: boolean;
  className?: string;
  as?: ElementType;
};

type ClickableProps<T extends ElementType> = ClickableOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ClickableOwnProps>;

const Clickable = forwardRef(
  <T extends ElementType = 'button'>(
    {
      as,
      children,
      className,
      disabled,
      hasWhiteBorder = false,
      ...props
    }: ClickableProps<T>,
    ref: React.Ref<Element>,
  ) => {
    const Component = as || 'button';
    const isButton = Component === 'button';

    const baseStyles = `
      relative inline-flex items-center justify-center
      rounded-xl
      border-[3px] ${hasWhiteBorder ? 'border-white' : 'border-foreground'}
      shadow-darkBottom
      transition duration-200 ease-out
    `;

    const interactionStyles = disabled
      ? 'opacity-50 cursor-not-allowed'
      : hasWhiteBorder
        ? 'hover:-translate-y-1 hover:shadow-whiteBottomLg active:translate-y-0 active:shadow-whiteBottom'
        : 'hover:-translate-y-1 hover:shadow-darkBottomLg active:translate-y-0 active:shadow-darkBottom';

    return (
      <Component
        ref={ref}
        className={twMerge(baseStyles, interactionStyles, className)}
        {...(isButton ? { disabled } : {})}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Clickable.displayName = 'Clickable';

export default Clickable;
