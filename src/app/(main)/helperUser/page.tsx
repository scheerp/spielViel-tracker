'use client';

import ChangePassword from '@components/ChangePassword';
import Checkbox from '@components/Checkbox';
import ImportButton from '@components/ImportButton';
import PrimaryButton from '@components/PrimaryButton';
import ResetUserPassword from '@components/ResetUserPassword';
import { useDevHudSetting } from '@hooks/useDevHudSettings';
import { signOut, useSession } from 'next-auth/react';

const HelperPage = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [showTimeHud, setShowTimeHud] = useDevHudSetting('timeHud');
  const [showScreenHud, setShowScreenHud] = useDevHudSetting('screenHud');
  const isAdmin = userRole === 'admin';

  return (
    <>
      <p className="md:mt6 ml-4 mt-4 text-xl md:ml-6">
        eingeloggt als: {session?.user?.username}
      </p>
      <p className="ml-4 mt-1 text-lg md:ml-6">Rolle: {userRole ?? '-'}</p>
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
          {isAdmin && <ResetUserPassword />}
        </div>

        {isAdmin && (
          <div className="mt-2 w-full max-w-xl rounded-xl border-2 border-foreground bg-backgroundDark p-4 text-base">
            <p className="mb-3 text-lg font-semibold">Developer HUDs</p>
            <div className="space-y-2">
              <Checkbox
                id="toggle-time-hud"
                checked={showTimeHud}
                onChange={setShowTimeHud}
                label="Zeit-HUD anzeigen"
              />
              <Checkbox
                id="toggle-screen-hud"
                checked={showScreenHud}
                onChange={setShowScreenHud}
                label="Screen-HUD anzeigen"
              />
            </div>
          </div>
        )}

        <PrimaryButton
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: '/',
            })
          }
          className="bg-error"
        >
          Ausloggen
        </PrimaryButton>
      </div>
    </>
  );
};

export default HelperPage;
