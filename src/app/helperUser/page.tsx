'use client';

import ImportButton from '@components/ImportButton';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const HelperPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <p className="m-4 text-xl lg:m-6">
        eingeloggt als: {session?.user?.username}
      </p>
      <div className="mx-auto mt-6 flex max-w-5xl flex-col items-center gap-4 p-6 text-xl">
        <a
          href={`https://docs.google.com/spreadsheets/d/1em6MANoODIlUtM904hvjerxMwfykKkpjQBB7WJlduGo/edit?usp=sharing`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
        >
          Helfer-innen Einteilung
        </a>
        <Link className="font-semibold underline" href="/helperUser/stats">
          Statistik
        </Link>
        <Link
          className="mb-12 font-semibold underline"
          href="/helperUser/gameSessions"
        >
          Brettspiel Sessions
        </Link>
        <ImportButton />
        <button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: '/',
            })
          }
          className="hover:bg-primary-dark mt-20 w-36 rounded-full bg-error px-4 py-2 font-bold text-white"
        >
          Ausloggen
        </button>
      </div>
    </>
  );
};

export default HelperPage;
