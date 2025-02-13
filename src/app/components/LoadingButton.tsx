import React from 'react';

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  buttonText: string;
  // Weitere Props oder Styling-Varianten nach Bedarf
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  buttonText,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 font-bold text-white shadow-sm transition-transform disabled:cursor-not-allowed disabled:opacity-50 ${className || ''} `}
    >
      {loading ? (
        <>
          <svg
            className="absolute left-4 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span className="ml-8">Wird geladen...</span>
        </>
      ) : (
        buttonText
      )}
    </button>
  );
};
