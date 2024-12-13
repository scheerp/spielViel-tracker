'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import MeepleIcon from '@icons/MeepleIcon';
import BarcodeIcon from '@icons/BarcodeIcon';
import CustomModal from './CustomModal';
import Scan from './Scan';

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="bg-primary px-[30px] py-[15px]">
      <nav className="flex w-full justify-between">
        <Link href="/">
          <Image
            className="mr-2"
            src="/spielViel-logo.png"
            alt={'spielViel-logo'}
            width={158}
            height={37}
            priority
          />
        </Link>
        {session ? (
          <div className="flex gap-3">
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
