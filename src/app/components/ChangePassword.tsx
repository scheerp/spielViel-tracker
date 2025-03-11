'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@context/NotificationContext';
import { AppError } from '../types/ApiError';

const ChangePassword = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setIsButtonDisabled(true);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('Token:', session?.accessToken);

    const form = event.target as HTMLFormElement;
    const currentPassword = (
      form.elements.namedItem('currentPassword') as HTMLInputElement
    ).value;
    const newPassword = (
      form.elements.namedItem('newPassword') as HTMLInputElement
    ).value;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Passwortänderung fehlgeschlagen');
      }

      showNotification({
        message: <div>Passwort erfolgreich geändert!</div>,
        type: 'success',
        duration: 3000,
      });

      router.push('/');
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: <div>Fehler: {error.detail.message}</div>,
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
      <h1 className="text-md font-semibold">Passwort ändern</h1>
      <form
        onSubmit={handleChangePassword}
        className="mt-4 flex w-full flex-col gap-4 text-base"
      >
        <input
          name="currentPassword"
          type="password"
          placeholder="Aktuelles Passwort"
          required
          className="rounded-full border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary md:mb-4"
        />
        <input
          name="newPassword"
          type="text"
          placeholder="Neues Passwort"
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
          {isLoading ? 'Ändern...' : 'Passwort ändern'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
