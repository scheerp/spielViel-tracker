'use client';

import React from 'react';

interface RatingHexagonProps {
  rating: number;
  bggId: number;
}

const RatingHexagon: React.FC<RatingHexagonProps> = ({ rating, bggId }) => {
  const roundedRating = rating ? rating.toFixed(1) : '0.0';

  const getColor = (rating: number): string => {
    if (rating == 10) return 'bg-[#249563]';
    if (rating >= 9) return 'bg-[#249563]';
    if (rating >= 8) return 'bg-[#2fc482]';
    if (rating >= 7) return 'bg-[#1d8acd]';
    if (rating >= 6) return 'bg-[#5369a2]';
    if (rating >= 5) return 'bg-[#5369a2]';
    if (rating >= 4) return 'bg-[#df4751]';
    if (rating >= 3) return 'bg-[#df4751]';
    if (rating >= 2) return 'bg-[#db303b]';
    return 'bg-[#db303b]';
  };

  const ratingNumber = parseFloat(roundedRating);
  const hexagonColorClass = getColor(ratingNumber);

  return (
    <a
      href={`https://boardgamegeek.com/boardgame/${bggId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="pt-2 text-sm font-bold text-white hover:underline"
    >
      <div className="mb-2 mr-5 h-16 w-16 md:h-24 md:w-24">
        <div
          className={`relative flex items-center justify-center text-2xl font-bold md:text-4xl ${hexagonColorClass} h-16 w-14 md:h-24 md:w-20`}
          style={{
            clipPath:
              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {roundedRating}
        </div>
      </div>
    </a>
  );
};

export default RatingHexagon;
