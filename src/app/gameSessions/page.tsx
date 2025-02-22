'use client';

import Loading from '@components/Loading';
import SessionTable from '@components/SessionTable';
import { useModal } from '@context/ModalContext';
import { useNotification } from '@context/NotificationContext';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export type SessionEntry = {
  id: number;
  vorname: string;
  nachname: string;
  email: string;
  created_at: string;
};

type SessionsResponse = {
  [sessionName: string]: SessionEntry[];
};

type NewSessionEntry = {
  vorname: string;
  nachname: string;
  email: string;
};

const Sessions: React.FC = () => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const { closeModal, updateModalLoading } = useModal();
  const [gameSessions, setGameSessions] = useState<SessionsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    redirect('/');
  }

  const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL!, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY!,
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) throw new Error('Fehler beim Laden der Sessions.');
      const data = await response.json();
      setGameSessions(data);
    } catch (err) {
      console.error('Fehler:', err);
      setError('Fehler beim Laden der Sessions.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: number) => {
    updateModalLoading(true);
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY!,
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) throw new Error('Fehler beim Löschen des Eintrags.');
      showNotification({
        message: `Eintrag erfolgreich gelöscht.`,
        type: 'success',
        duration: 1500,
      });
      fetchSessions();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    } finally {
      updateModalLoading(false);
      closeModal();
    }
  };

  const addSession = async (sessionName: string, newEntry: NewSessionEntry) => {
    if (!newEntry?.vorname || !newEntry?.nachname) {
      showNotification({
        message: 'Bitte alle Felder ausfüllen.',
        type: 'error',
        duration: 1500,
      });
      return;
    }

    try {
      const response = await fetch(API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY!,
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          vorname: newEntry.vorname,
          nachname: newEntry.nachname,
          email: newEntry.email,
          session: sessionName,
        }),
      });

      if (!response.ok) throw new Error('Fehler beim Erstellen des Eintrags.');
      showNotification({
        message: `Eintrag erfolgreich hinzugefügt.`,
        type: 'success',
        duration: 1500,
      });
      fetchSessions();
    } catch (err) {
      console.error('Fehler beim Erstellen:', err);
    }
  };

  const updateSession = async (
    id: number,
    updatedEntry: { vorname: string; nachname: string; email: string },
  ) => {
    if (
      !id ||
      !updatedEntry.vorname ||
      !updatedEntry.nachname ||
      !updatedEntry.email
    ) {
      showNotification({
        message: 'Bitte alle Felder ausfüllen.',
        type: 'error',
        duration: 1500,
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY!,
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ ...updatedEntry, id }),
      });

      if (!response.ok)
        throw new Error('Fehler beim Aktualisieren des Eintrags.');

      showNotification({
        message: `Eintrag erfolgreich aktualisiert.`,
        type: 'success',
        duration: 1500,
      });

      fetchSessions();
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
      showNotification({
        message: `Fehler beim Aktualisieren des Eintrags.`,
        type: 'error',
        duration: 1500,
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) return <Loading />;
  if (error) return null;

  return (
    <div className="mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">Verfügbare Brettspielsessions</h2>
      {gameSessions &&
        Object.entries(gameSessions).map(([sessionName, participants]) => (
          <SessionTable
            key={sessionName}
            sessionName={sessionName}
            participants={participants}
            addSession={addSession}
            deleteSession={deleteSession}
            updateSession={updateSession}
          />
        ))}
    </div>
  );
};

export default Sessions;
