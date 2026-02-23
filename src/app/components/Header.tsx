'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import BarcodeIcon from '@icons/BarcodeIcon';
import Scan from './Scan';
import { useModal } from '@context/ModalContext';
import Loading from './Loading';
import HamburgerMenu from './HamburgerMenu';
import HamburgerButton from './HamburgerButton';
import { useState } from 'react';

const Header = () => {
  const { data: session } = useSession();
  const { openModal } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className="fixed z-50 flex h-20 w-full items-center bg-[url('/header_app.png')] bg-cover bg-center px-[30px] py-[15px] pr-2 shadow-lg">
        <nav className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              className="mr-2 h-[50px] w-auto"
              src="/spielviel-app-icon.svg"
              alt="spielViel-logo"
              width={120}
              height={50}
              sizes="auto"
              style={{ height: '50px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden gap-6 font-semibold text-white [font-stretch:125%] lg:flex">
            <Link href="/">Home</Link>
            <Link href="/">Spieleliste</Link>
            <Link href="/favoriten">Favoriten</Link>
            <Link href="/partieSuche">Partiesuche</Link>

            {(session && session && session?.user?.role === 'admin') ||
            session?.user?.role === 'helper' ? (
              <div className="flex gap-6 font-medium [font-stretch:100%]">
                <Link href="/programm">Programm</Link>
                <Link href="/helperUser/stats">Statistik</Link>
                <Link href="/helperUser">Helfer*innen</Link>
              </div>
            ) : (
              <Link href="/login" className="font-medium">
                Login
              </Link>
            )}
          </div>
          <div className="flex items-center">
            {session &&
              (session?.user?.role === 'admin' ||
                session?.user?.role === 'helper') && (
                <div className="flex items-center gap-3">
                  <button
                    className="h-14 w-14 p-2 lg:h-16 lg:w-16"
                    onClick={() =>
                      openModal((loadingFromContext) => (
                        <>
                          <Scan />
                          {loadingFromContext && <Loading />}
                        </>
                      ))
                    }
                  >
                    <BarcodeIcon tailwindColor="text-white" />
                  </button>
                </div>
              )}
            <HamburgerButton menuOpen={menuOpen} toggleMenu={toggleMenu} />
          </div>
        </nav>
      </header>

      <HamburgerMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </>
  );
};

export default Header;
