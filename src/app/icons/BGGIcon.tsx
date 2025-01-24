const BGGIcon = ({
  tailwindColor,
  className,
}: {
  tailwindColor: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-12 w-10 ${tailwindColor} ${className}`}
    >
      <title>BoardGameGeek</title>
      <path
        fill="currentColor"
        d="m19.7 4.44-2.38.64L19.65 0 4.53 5.56l.83 6.67-1.4 1.34L8.12 24l8.85-3.26 3.07-7.22-1.32-1.27.98-7.81Z"
      />
    </svg>
  );
};

export default BGGIcon;
