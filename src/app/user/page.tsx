'use client';

import ImportButton from '@components/ImportButton';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const HelperPage = () => {
  const { data: session } = useSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="mx-auto mt-20 flex max-w-5xl flex-col items-center gap-4 p-6 text-xl">
      <Link className="font-semibold underline" href="/stats">
        Statistik
      </Link>
      <Link className="mb-12 font-semibold underline" href="/gameSessions">
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
