'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import MeepleIcon from '@icons/MeepleIcon';
import BarcodeIcon from '@icons/BarcodeIcon';
import Scan from './Scan';
import { useModal } from '@context/ModalContext';
import Loading from './Loading';

const Header = () => {
  const { data: session } = useSession();
  const { openModal } = useModal();
  return (
    <header className="fixed z-40 flex h-20 w-full items-center bg-primary px-[30px] py-[15px]">
      <nav className="flex w-full items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            className="mr-2"
            src="/spielViel-logo.png"
            alt="spielViel-logo"
            width={0}
            height={50}
            sizes="auto"
            style={{ height: '50px', width: 'auto' }}
            priority
          />
        </Link>
        {session ? (
          <div className="flex items-center gap-3">
            <Link href="/helperUser">
              <MeepleIcon tailwindColor="text-white" />
            </Link>

            <button
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
        ) : (
          <Link href="/login">
            <MeepleIcon tailwindColor="text-primary" />
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
