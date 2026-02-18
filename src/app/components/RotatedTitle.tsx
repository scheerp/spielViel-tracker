import React from 'react';
import { twMerge } from 'tailwind-merge';

type RotatedTitleProps = {
  text: string;
  tailwindBgColor: string;
  className?: string;
};

const RotatedTitle: React.FC<RotatedTitleProps> = ({
  text,
  tailwindBgColor,
  className,
}) => {
  return (
    <div
      className={twMerge(
        `px-18 relative my-0 mt-8 rotate-[-5deg] rounded-xl border-[3px] border-foreground py-2 shadow-[9px_5px_0_-1px_#4A3244] before:absolute before:inset-0 before:-z-10 ${tailwindBgColor}`,
        className,
      )}
    >
      <h1 className="mx-6 my-2 text-center text-3xl font-semibold text-white text-shadow-outline-dark [font-stretch:125%] md:mx-9 md:my-4 md:text-5xl">
        {text}
      </h1>
    </div>
  );
};

export default RotatedTitle;
