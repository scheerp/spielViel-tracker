'use client';

import ChangePassword from '@components/ChangePassword';
import ImportButton from '@components/ImportButton';
import ResetUserPassword from '@components/ResetUserPassword';
import { signOut, useSession } from 'next-auth/react';

const HelperPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <p className="md:mt6 ml-4 mt-4 text-xl md:ml-6">
        eingeloggt als: {session?.user?.username}
      </p>
      <div className="mx-auto mt-6 flex flex-col items-center gap-4 p-6 text-xl">
        <a
          href={`https://docs.google.com/spreadsheets/d/1em6MANoODIlUtM904hvjerxMwfykKkpjQBB7WJlduGo/edit?usp=sharing`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 font-semibold underline"
        >
          Helfer*innen Einteilung
        </a>
        <div className="flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row md:items-start">
          <ImportButton />
          <ChangePassword />
          {session?.user?.role === 'admin' && <ResetUserPassword />}
        </div>
        <button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: '/',
            })
          }
          className="hover:bg btn mt-6 rounded-full bg-error px-3 py-2.5 font-bold text-white shadow-sm"
        >
          Ausloggen
        </button>
      </div>
    </>
  );
};

export default HelperPage;
