'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';

const ResetUserPassword = () => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setIsButtonDisabled(true);

    const form = event.target as HTMLFormElement;
    const usernameOrEmail = (
      form.elements.namedItem('usernameOrEmail') as HTMLInputElement
    ).value;

    const queryParams = new URLSearchParams({
      username_or_email: String(usernameOrEmail),
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reset-password?${queryParams.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Passwort-Reset fehlgeschlagen');
      }

      showNotification({
        message: (
          <div>
            {data.message}
            <br />
            username: <b>{data.user}</b>
            <br />
            default Passwort: <b>{data.default}</b>
          </div>
        ),
        type: 'success',
        duration: 10000,
      });

      form.reset();
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: (
          <div>
            Fehler: {error.detail?.message || 'Ein Fehler ist aufgetreten'}
          </div>
        ),
        type: 'error',
        duration: 2000,
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsButtonDisabled(false);
      }, 1000);
    }
  };

  return (
    <div className="flex w-72 flex-col items-center rounded-xl bg-white p-8 shadow-md">
      <h1 className="text-md font-semibold">
        Passwort für Helfer*in zurücksetzen
      </h1>
      <form
        onSubmit={handleResetPassword}
        className="mt-4 flex w-full flex-col gap-4 text-base"
      >
        <input
          name="usernameOrEmail"
          type="text"
          placeholder="E-Mail/Username"
          required
          className="rounded-full border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary md:mb-4"
        />
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`btn mt-4 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm ${
            isButtonDisabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isLoading ? 'Zurücksetzen...' : 'Passwort zurücksetzen'}
        </button>
      </form>
    </div>
  );
};

export default ResetUserPassword;
