const FilterIcon = ({
  tailwindColor,
  className,
}: {
  tailwindColor: string;
  className: string;
}) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 38 38"
        className={`h-6 w-6 ${tailwindColor} ${className}`}
      >
        <circle
          cx="10"
          cy="10"
          r="5"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <rect x="22" y="8" width="15" height="5" rx="2.5" fill="currentColor" />
        <rect
          x="2.5"
          y="24.5"
          width="15"
          height="5"
          rx="2.5"
          fill="currentColor"
        />
        <circle
          cx="29"
          cy="27"
          r="5"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default FilterIcon;
