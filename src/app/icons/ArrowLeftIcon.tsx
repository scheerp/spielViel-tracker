const ArrowLeftIcon = ({
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
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`h-6 w-6 ${tailwindColor} ${className}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
};

export default ArrowLeftIcon;
