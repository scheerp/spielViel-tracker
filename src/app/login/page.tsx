'use client';

import { useNotification } from '@context/NotificationContext';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setIsButtonDisabled(true);

    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        showNotification({
          message: <div>Login fehlgeschlagen: {result.error}</div>,
          type: 'error',
          duration: 3000,
        });
      } else {
        showNotification({
          message: <div>Erfolgreich eingeloggt!</div>,
          type: 'success',
          duration: 3000,
        });
        router.push('/');
      }
    } catch (error) {
      showNotification({
        message: <div>Ein unerwarteter Fehler ist aufgetreten.</div>,
        type: 'error',
        duration: 3000,
      });
      console.error('Login-Fehler:<br/>', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsButtonDisabled(false);
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-60 flex flex-col items-center rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-xl font-semibold">Login</h1>
        <form
          onSubmit={handleLogin}
          className="mt-4 flex w-full max-w-sm flex-col gap-4"
        >
          <input
            name="username"
            type="text"
            placeholder="Benutzername"
            required
            className="rounded-xl border-2 px-2 py-2.5"
          />
          <input
            name="password"
            type="password"
            placeholder="Passwort"
            required
            className="rounded-xl border-2 px-2 py-2.5"
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`btn mt-4 rounded-full bg-primary py-2.5 text-white shadow-sm ${
              isButtonDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
