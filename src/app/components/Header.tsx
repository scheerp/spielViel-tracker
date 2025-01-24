'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import MeepleIcon from '@icons/MeepleIcon';
import BarcodeIcon from '@icons/BarcodeIcon';
import CustomModal from './CustomModal';
import Scan from './Scan';

const Header = () => {
  const { data: session } = useSession();
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
            <MeepleIcon tailwindColor="text-white" onClick={signOut} />

            <CustomModal trigger={<BarcodeIcon tailwindColor="text-white" />}>
              <Scan />
            </CustomModal>
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
