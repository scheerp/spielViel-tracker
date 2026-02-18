'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';
import Clickable from '@components/Clickable';

interface ModalContextType {
  openModal: (content: (loading: boolean) => ReactNode) => void;
  closeModal: () => void;
  updateModalLoading: (loading: boolean) => void;
  modalLoading: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalContent, setModalContent] = useState<
    ((loading: boolean) => ReactNode) | null
  >(null);
  const [modalLoading, setModalLoading] = useState(false);
  const pathname = usePathname();

  const openModal = (content: (loading: boolean) => ReactNode) => {
    setModalContent(() => content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const updateModalLoading = (loading: boolean) => {
    setModalLoading(loading);
  };

  useEffect(() => {
    closeModal();
  }, [pathname]);

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, updateModalLoading, modalLoading }}
    >
      {children}
      {modalContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-60 pt-10"
          onClick={closeModal}
        >
          <div
            className="absolute inset-x-5 inset-y-10 overflow-scroll rounded-xl border-[3px] border-foreground bg-background p-6 pt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Clickable
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center bg-white text-xl md:text-3xl"
              aria-label="Close modal"
            >
              ✕
            </Clickable>
            {modalContent(modalLoading)}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
