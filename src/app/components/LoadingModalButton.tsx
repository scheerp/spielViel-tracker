import { useModal } from '@context/ModalContext';
import React from 'react';
import Loading from './Loading';
import PrimaryButton from './PrimaryButton';

type LoadingModalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean;
  buttonText: string;
  onClickFunction?: () => void;
  modalText?: React.ReactNode;
  modalButtonText?: string;
};

export const LoadingModalButton: React.FC<LoadingModalButtonProps> = ({
  loading = false,
  buttonText,
  className,
  onClickFunction,
  modalText,
  modalButtonText,
}) => {
  const { openModal } = useModal();
  return (
    <PrimaryButton
      onClick={() =>
        openModal((loadingFromContext) => (
          <div className="mt-6 flex flex-col justify-center text-center">
            {modalText}
            <PrimaryButton
              onClick={onClickFunction}
              disabled={loadingFromContext}
            >
              {modalButtonText}
            </PrimaryButton>
            {loadingFromContext && <Loading />}
          </div>
        ))
      }
      disabled={loading}
      className={className}
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
    </PrimaryButton>
  );
};
