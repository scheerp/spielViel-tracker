'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

type HamburgerMenuType = { menuOpen: boolean; toggleMenu: () => void };

const HamburgerMenu = ({ menuOpen, toggleMenu }: HamburgerMenuType) => {
  const { data: session } = useSession();
  return (
    <div
      className={`fixed inset-0 top-20 z-40 transition-all lg:hidden ${
        menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 top-20 bg-black transition-opacity ${
          menuOpen ? 'opacity-60' : 'opacity-0'
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Menu Content */}
      <div
        className={`fixed transition-transform ${
          menuOpen
            ? 'top-20 transform-none'
            : '-translate-y-full lg:-translate-y-0 lg:translate-x-full'
        } ${'right-0 w-full'} ${'lg:right-0 lg:top-0 lg:h-full lg:w-1/3'}`}
      >
        <div className="rounded-b-xl bg-white p-5">
          <div className="flex flex-col items-center text-xl font-semibold">
            <Link href="/" className="px-6 py-4" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/" className="px-6 py-4" onClick={toggleMenu}>
              Spieleliste
            </Link>
            <Link
              href="/partieSuche"
              className="px-6 py-4"
              onClick={toggleMenu}
            >
              Partiesuche
            </Link>
            <Link href="/programm" className="px-6 py-4" onClick={toggleMenu}>
              Programm
            </Link>
            {(session && session?.user?.role === 'admin') ||
            session?.user?.role === 'helper' ? (
              <div className="flex flex-col items-center font-medium">
                <Link
                  href="/helperUser"
                  className="px-6 py-4"
                  onClick={toggleMenu}
                >
                  Helfer*innen
                </Link>
                <Link
                  href="/helperUser/stats"
                  className="px-6 py-4"
                  onClick={toggleMenu}
                >
                  Statistik
                </Link>
                <Link
                  href="/helperUser/gameSessions"
                  className="px-6 py-4"
                  onClick={toggleMenu}
                >
                  Sessions
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-4 text-xl text-gray-400"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
