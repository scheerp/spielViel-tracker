'use client';

import { useState, useEffect } from 'react';

interface CustomModalProps {
  children?: React.ReactNode;
  trigger: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ children, trigger }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (showModal) {
        closeModal();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showModal]);

  return (
    <>
      <div onClick={openModal}>{trigger}</div>
      {showModal ? (
        <>
          <div
            className="fixed inset-0 z-20 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-60 outline-none focus:outline-none"
            onClick={closeModal}
          >
            <div
              className="absolute inset-x-5 inset-y-10 rounded-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full flex-col overflow-auto p-7 py-3">
                <button
                  onClick={closeModal}
                  className="absolute -right-0 -top-0 flex h-12 w-12 items-center justify-center self-end rounded text-xl text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white md:right-2 md:top-2 md:text-3xl"
                  aria-label="Close modal"
                >
                  ✕
                </button>
                {children}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CustomModal;
