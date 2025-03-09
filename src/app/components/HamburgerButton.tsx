'use client';

type HamburgerButtonType = { menuOpen: boolean; toggleMenu: () => void };

const HamburgerButton = ({ menuOpen, toggleMenu }: HamburgerButtonType) => {
  return (
    <button
      onClick={toggleMenu}
      className={`flex h-14 w-14 flex-col items-center justify-center space-y-1 transition-all duration-300 lg:hidden ${menuOpen ? 'rotate-45' : ''}`}
      aria-label="Toggle navigation menu"
    >
      <div
        className={`h-[3px] w-6 rounded bg-white transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-180' : ''}`}
      ></div>
      <div
        className={`h-[3px] w-6 rounded bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}
      ></div>
      <div
        className={`h-[3px] w-6 rounded bg-white transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-[270deg]' : ''}`}
      ></div>
    </button>
  );
};

export default HamburgerButton;
