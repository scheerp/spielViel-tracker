'use client';

import { useNotification } from '@context/NotificationContext';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

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
      } else if (result?.ok) {
        showNotification({
          message: <div>Erfolgreich eingeloggt!</div>,
          type: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      showNotification({
        message: <div>Ein unerwarteter Fehler ist aufgetreten.</div>,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="m-auto flex h-screen max-w-lg flex-col items-center justify-center">
      <h1 className="mx-8 -mt-40 mb-12 items-center text-center text-xl font-semibold md:mb-20">
        Liebe SpielViel Besucher*in, <br /> im Moment steht der Login leider nur
        unseren Helfer*innen zur verfügung. Du kannst unsere App trotzdem ohne
        Login und ohne Probleme nutzen. <br />
        <br />
        <Link href="/" className="underline">
          Hier
        </Link>{' '}
        gehts zurück zu den Spielen!
      </h1>
      <div className="flex flex-col items-center rounded-xl bg-white p-8 shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">Login</h2>
        <form
          onSubmit={handleLogin}
          className="mt-4 flex w-full max-w-sm flex-col gap-4"
        >
          <input
            name="username"
            type="text"
            placeholder="E-Mail / Username"
            required
            className="rounded-full border-2 px-3 py-2.5"
          />
          <input
            name="password"
            type="password"
            placeholder="Passwort"
            required
            className="rounded-full border-2 px-3 py-2.5"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`btn mt-4 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
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
