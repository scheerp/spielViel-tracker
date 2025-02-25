'use client';

import ImportButton from '@components/ImportButton';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const HelperPage = () => {
  const { data: session } = useSession();

  return (
    <div className="mx-auto mt-20 flex max-w-5xl flex-col items-center gap-4 p-6 text-xl">
      <p>eingeloggt als: {session?.user?.username}</p>
      <a
        href={`https://www.youtube.com/watch?v=dQw4w9WgXcQ`} // TODO add the real link here
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline"
      >
        Helfereinteilung
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
  );
};

export default HelperPage;
