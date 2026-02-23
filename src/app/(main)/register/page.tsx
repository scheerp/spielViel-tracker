'use client';

import { useNotification } from '@context/NotificationContext';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { AppError } from '../../types/ApiError';
import Loading from '@components/Loading';
import { signIn, signOut, useSession } from 'next-auth/react';

const Register = () => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const searchParams = useSearchParams();
  const registrationKey = searchParams.get('registrationKey');

  const handleRegistration = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            invite_code: registrationKey,
          }),
        },
      );

      if (!response.ok) {
        const error = (await response.json()) as AppError;
        throw error;
      }

      await signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: '/',
      });

      showNotification({
        message: `${username} erfolgreich registriert und angemeldet`,
        type: 'success',
        duration: 3000,
      });
    } catch (err) {
      const error = err as AppError;

      showNotification({
        message: (
          <div>
            {error.detail.message}
            <br />
            {error.detail.detailed_message}
          </div>
        ),
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-60 flex flex-col items-center rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-xl font-semibold">Registrierung</h1>
        <form
          onSubmit={handleRegistration}
          className="mt-4 flex w-full max-w-sm flex-col gap-4"
        >
          <input
            name="username"
            type="text"
            placeholder="Benutzername"
            required
            className="rounded-full border-2 px-3 py-2.5"
          />
          <input
            name="email"
            type="text"
            placeholder="E-Mail Adresse"
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
            disabled={isButtonDisabled}
            className={`btn mt-4 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm ${
              isButtonDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {loading ? 'Registrieren...' : 'Registrieren'}
          </button>
        </form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { data: session } = useSession();

  if (session) signOut();
  return (
    <Suspense fallback={<Loading />}>
      <Register />
    </Suspense>
  );
};

export default RegisterPage;
