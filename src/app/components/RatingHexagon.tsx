'use client';

import React from 'react';

interface RatingHexagonProps {
  rating: number;
}

const RatingHexagon: React.FC<RatingHexagonProps> = ({ rating }) => {
  const roundedRating = rating ? rating.toFixed(1) : '0.0';

  const getColor = (rating: number): string => {
    if (rating >= 8) return 'bg-green-500';
    if (rating >= 6) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const ratingNumber = parseFloat(roundedRating);
  const hexagonColorClass = getColor(ratingNumber);

  return (
    <div className="mr-5 h-16 w-16 md:h-24 md:w-24">
      <div
        className={`relative flex items-center justify-center text-lg font-bold text-white md:text-2xl ${hexagonColorClass} h-16 w-16 md:h-24 md:w-24`}
        style={{
          clipPath:
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {roundedRating}
      </div>
    </div>
  );
};

export default RatingHexagon;
