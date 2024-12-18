const ArrowUpIcon = ({
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
        viewBox="0 0 463.96 512"
        className={`h-4 w-4 ${tailwindColor} ${className}`}
      >
        <path
          fill="currentColor"
          d="M332.67 512V268.5h92.3c15.48-.68 26.47-5.77 32.82-15.42 17.21-25.8-5.25-52.31-22.6-69.25L261.61 14.33c-17.29-19.11-41.93-19.11-59.22 0L24.42 188.72C8.03 204.78-9.67 229.27 6.21 253.08c6.35 9.65 17.34 14.74 32.81 15.42h92.31V512h201.34z"
        />
      </svg>
    </div>
  );
};

export default ArrowUpIcon;
