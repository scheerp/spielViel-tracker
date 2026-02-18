'use client';

import React from 'react';
import Clickable from './Clickable';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-40 pt-20 transition-all ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 mt-20 bg-black transition-opacity ${
          isOpen ? 'opacity-60' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <div
        className={`fixed transition-transform ${
          isOpen
            ? 'transform-none'
            : 'translate-y-full md:-translate-y-0 md:translate-x-full'
        } ${'bottom-0 right-0 h-full w-full'} ${'md:right-0 md:top-0 md:h-full md:w-1/3'}`}
      >
        <div className="mt-20 h-full bg-background">
          <Clickable
            onClick={onClose}
            className="absolute right-2 top-4 mt-20 flex h-12 w-12 items-center justify-center bg-white text-xl font-extrabold focus:outline-none focus:ring-2 focus:ring-white md:text-3xl"
            aria-label="Close modal"
          >
            ✕
          </Clickable>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
