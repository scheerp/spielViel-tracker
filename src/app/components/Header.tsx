'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import MeepleIcon from './MeepleIcon';
import Image from 'next/legacy/image';

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="bg-primary px-[30px] py-[15px] text-white">
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
          <MeepleIcon tailwindColor="text-white" onClick={signOut} />
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
