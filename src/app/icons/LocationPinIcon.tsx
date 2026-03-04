import { CSSProperties } from 'react';

const LocationPinIcon = ({
  tailwindColor,
  className,
  style,
}: {
  tailwindColor?: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <svg
      style={style}
      className={`h-10 w-10 ${tailwindColor} relative ${className}`}
      fill="currentColor"
      height="256px"
      width="256px"
      version="1.1"
      id="Filled_Icons"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      stroke="var(--foreground)"
      strokeWidth="1"
    >
      <g id="Location-Pin-Filled">
        <path
          d="M12,1c-4.97,0-9,4.03-9,9c0,6.75,9,13,9,13s9-6.25,9-13C21,5.03,16.97,1,12,1z"
          fill="currentColor"
          stroke="var(--foreground)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default LocationPinIcon;
