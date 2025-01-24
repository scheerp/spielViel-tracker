import Image from 'next/image';
import React from 'react';

type GameDetailsPropertyProps = {
  value: string;
  icon: string;
  property: string;
  context: 'list' | 'detail';
};

const GameDetailsProperty = ({
  value,
  icon,
  property,
  context,
}: GameDetailsPropertyProps) => {
  if (context === 'list') {
    return (
      <div className="mr-2 flex flex-col items-center">
        <Image
          src={icon}
          alt={`${property}icon`}
          priority
          fill={false}
          width={20}
          height={20}
          className="opacity-50"
        />
        {value}
      </div>
    );
  }
  return null;
};

export default GameDetailsProperty;
