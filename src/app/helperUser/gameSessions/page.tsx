'use client';

import FancyLoading from '@components/FancyLoading';
import SessionTable from '@components/SessionTable';
import { useModal } from '@context/ModalContext';
import { useNotification } from '@context/NotificationContext';
import { convertDayToDate } from '@lib/utils';
import React, { useState, useEffect } from 'react';

export type SessionEntry = {
  id: number;
  vorname: string;
  nachname: string;
  email: string;
  handynummer: string;
  created_at: string;
};

type SessionsResponse = {
  [sessionName: string]: SessionEntry[];
};

export type Session = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'boardgame' | 'pnp';
  duration: number;
  location: string;
  imageUrl?: string;
  maxPlayers: number;
  participants: SessionEntry[];
  oldFormat: string;
};

// TODO: This is a temporary solution to handle the sessions
const sessionMetadata: Record<
  string,
  {
    name: string;
    type: 'boardgame' | 'pnp';
    maxPlayers?: number;
    imageUrl?: string;
    duration: number;
    location: string;
  }
> = {
  'This War of Mine': {
    name: 'This War of Mine',
    type: 'boardgame',
    maxPlayers: 4,
    location: 'Session Raum I',
    duration: 180,
    imageUrl:
      'https://cf.geekdo-images.com/gQOQW7p1RWHzY54Lrs-_pA__original/img/PSC8BO2njNcBJhxvi0IV5Jb5hgo=/0x0/filters:format(jpeg)/pic3315915.jpg',
  },
  Civolution: {
    name: 'Civolution',
    type: 'boardgame',
    maxPlayers: 4,
    location: 'Gruppenraum II',
    duration: 180,
    imageUrl:
      'https://cf.geekdo-images.com/DahMIPzUpexvhUPAG3dGbA__original/img/P01WNfQ0kOF9n7FFNXpGCo-tueE=/0x0/filters:format(jpeg)/pic8303209.jpg',
  },
  'Arche Nova': {
    name: 'Arche Nova',
    type: 'boardgame',
    maxPlayers: 4,
    location: 'Gruppenraum II',
    duration: 240,
    imageUrl:
      'https://cf.geekdo-images.com/SoU8p28Sk1s8MSvoM4N8pQ__original/img/g4S18szTdrXCdIwVKzMKrZrYAcM=/0x0/filters:format(jpeg)/pic6293412.jpg',
  },
  'Dune: Imperium Uprising': {
    name: 'Dune: Imperium Uprising',
    type: 'boardgame',
    maxPlayers: 4,
    location: 'Saal',
    duration: 180,
    imageUrl:
      'https://cf.geekdo-images.com/UVUkjMV_Q2paVUIUP30Vvw__original/img/BoUtCkd1NRO0bR1R5EwL51xIuXA=/0x0/filters:format(jpeg)/pic7664424.jpg',
  },
  'Das schwarze Auge - Das Geheimnis des Grünen Ritters': {
    name: 'Das schwarze Auge - Das Geheimnis des Grünen Ritters',
    type: 'pnp',
    maxPlayers: 6,
    location: 'Pen & Paper Studio',
    duration: 300,
    imageUrl:
      'https://spielviel.net/wp-content/uploads/2025/03/Ritter-Titel-gruen.png',
  },
  'Herz der Finsternis': {
    name: 'Herz der Finsternis',
    type: 'pnp',
    maxPlayers: 6,
    location: 'Saal',
    duration: 180,
  },
  "Aeon's End": {
    name: "Aeon's End - Ein neues Zeitalter",
    type: 'boardgame',
    maxPlayers: 4,
    location: 'Session Raum I',
    duration: 120,
    imageUrl:
      'https://cf.geekdo-images.com/ZoIYlIzfph5yGuwQGKYneA__original/img/lHafKKkBdHF-LQhP1ZT7vss1qbg=/0x0/filters:format(jpeg)/pic4628176.jpg',
  },
  'Slay the Spire': {
    name: 'Slay the Spire',
    type: 'boardgame',
    maxPlayers: 3,
    location: 'Session Raum II',
    duration: 210,
    imageUrl:
      'https://cf.geekdo-images.com/PQzVclEoOQ_wr4e1V86kxA__original/img/KXOf1hP1cIJQLabKhZulWP-e9wI=/0x0/filters:format(png)/pic8157856.png',
  },
  'Blood on the Clocktower': {
    name: 'Blood on the Clocktower',
    type: 'boardgame',
    maxPlayers: 12,
    location: 'Session Raum III',
    duration: 150,
    imageUrl:
      'https://cf.geekdo-images.com/HINb2nkFn5IiZxAlzQIs4g__original/img/e7izEwSmnBPiErsIF6hlWbgybBE=/0x0/filters:format(jpeg)/pic7009391.jpg',
  },
  'Call of Cthulhu - Was ist da im Keller': {
    name: 'Call of Cthulhu - Was ist da im Keller',
    type: 'pnp',
    maxPlayers: 6,
    location: 'Pen & Paper Studio',
    duration: 120,
    imageUrl:
      'https://spielviel.net/wp-content/uploads/2025/03/Was-ist-da-im-Keller.jpg',
  },
  'Lords of Waterdeep': {
    name: 'Lords of Waterdeep + Expansion',
    type: 'boardgame',
    maxPlayers: 6,
    location: 'Session Raum I',
    duration: 120,
    imageUrl:
      'https://cf.geekdo-images.com/ChZSk2MECGjo_WUjuKkfPw__original/img/66YlwLcR1HcfGjVBEKMPcjA7Ih4=/0x0/filters:format(jpeg)/pic1590236.jpg',
  },
  'Call of Cthulhu - Der tote Gast': {
    name: 'Call of Cthulhu - Der tote Gast',
    type: 'pnp',
    maxPlayers: 6,
    location: 'Pen & Paper Studio',
    duration: 120,
    imageUrl:
      'https://spielviel.net/wp-content/uploads/2025/03/Der-Tote-Gast.jpg',
  },
  'Das Unbewusste': {
    name: 'Das Unbewusste',
    type: 'boardgame',
    maxPlayers: 4,
    location: 'Session Raum III',
    duration: 240,
    imageUrl:
      'https://cf.geekdo-images.com/ufkAbhulnKJ7uDpi09TXOQ__original/img/hhBc0bcNj9U3t-4trByrjrO8-ro=/0x0/filters:format(jpeg)/pic7127448.jpg',
  },
  'Tales of the Arabian Nights': {
    name: 'Tales of the Arabian Nights',
    type: 'boardgame',
    maxPlayers: 6,
    location: 'Session Raum II',
    duration: 180,
    imageUrl:
      'https://cf.geekdo-images.com/ibYzk1WgVEEnC0hnXdpqpg__original/img/AOEgHEj7ER6T0AEfDVuS3s-dTI8=/0x0/filters:format(jpeg)/pic486114.jpg',
  },
  CY_Borg: {
    name: 'CY_BORG',
    type: 'pnp',
    maxPlayers: 5,
    location: 'Pen & Paper Studio',
    duration: 180,
    imageUrl:
      'https://cdn.commoninja.com/asset/7972c33b-35df-45da-ae54-57cc615f4872.jpg',
  },
  'Massive Darkness Höllenschlund': {
    name: 'Massive Darkness - Höllenschlund',
    type: 'boardgame',
    maxPlayers: 6,
    location: 'Session Raum I',
    duration: 190,
    imageUrl:
      'https://cf.geekdo-images.com/e-QmT0KuEc0E4bWNih6EVQ__original/img/alQDRawS3Soxpe-sCU3_WBNUCNk=/0x0/filters:format(png)/pic6107854.png',
  },
  Eclipse: {
    name: 'Eclipse',
    type: 'boardgame',
    maxPlayers: 5,
    location: 'Session Raum III',
    duration: 200,
    imageUrl:
      'https://cf.geekdo-images.com/Oh3kHw6lweg6ru71Q16h2Q__original/img/yW7d4RNfU1ndISCaPlfGYUyxnRU=/0x0/filters:format(jpeg)/pic5235277.jpg',
  },
  'Dungeons and Dragons 5e – Die Banditen von Unterholz': {
    name: 'Dungeons and Dragons – Die Banditen von Unterholz',
    type: 'pnp',
    maxPlayers: 5,
    location: 'Pen & Paper Studio',
    duration: 180,
    imageUrl:
      'https://spielviel.net/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-04-at-11.24.47.jpeg',
  },
};

export type NewSessionEntry = {
  vorname: string;
  nachname: string;
  email: string;
  handynummer: string;
};

// TODO: This is a temporary solution to handle the sessions
const parseSessions = (data: SessionsResponse): Session[] => {
  return Object.entries(data)
    .map(([sessionKey, participants]) => {
      const match = sessionKey.match(/^([^,]+),\s([^:]+):\s(.+)$/);

      if (!match) {
        return null as never;
      }

      const [, day, time, gameNameRaw] = match;
      const gameName = gameNameRaw.trim();

      const meta = sessionMetadata[gameName] || {
        name: gameName || 'Unbekanntes Spiel',
        type: 'boardgame',
      };

      // Rückgabe des alten Formats für Editieren/Anlegen
      return {
        oldFormat: sessionKey, // Wir speichern den alten Format-Namen
        id: `${day}-${time}-${gameName}`,
        name: meta.name,
        date: convertDayToDate(day),
        time,
        duration: meta.duration || 0,
        location: meta.location || '',
        type: meta.type as 'boardgame' | 'pnp',
        imageUrl: meta.imageUrl || '',
        maxPlayers: meta.maxPlayers ?? 0,
        participants: participants.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
      };
    })
    .filter(Boolean);
};

const groupSessionsByDay = (sessions: Session[]): Record<string, Session[]> => {
  const grouped: Record<string, Session[]> = {};
  const daysOfWeek = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
    'Sonntag',
  ];

  // Gruppiere Sessions nach Wochentagen
  sessions.forEach((session) => {
    const day = new Date(session.date).toLocaleDateString('de-DE', {
      weekday: 'long',
    }); // z.B. 'Freitag'

    if (!grouped[day]) {
      grouped[day] = [];
    }

    grouped[day].push(session);
  });

  // Sortiere die Wochentage nach der richtigen Reihenfolge
  const sortedGrouped: Record<string, Session[]> = {};
  daysOfWeek.forEach((day) => {
    if (grouped[day]) {
      // Sortiere die Sessions innerhalb jedes Wochentages nach der Uhrzeit
      sortedGrouped[day] = grouped[day].sort((a, b) => {
        return a.time.localeCompare(b.time); // Vergleicht die Zeit im Format HH:mm
      });
    }
  });

  return sortedGrouped;
};

const Sessions: React.FC = () => {
  const { showNotification } = useNotification();
  const { closeModal, updateModalLoading } = useModal();
  const [gameSessions, setGameSessions] = useState<SessionsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Freitag');

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
      showNotification({
        message: `Fehler beim Löschen des Eintrags.`,
        type: 'error',
        duration: 1500,
      });
    } finally {
      updateModalLoading(false);
      closeModal();
    }
  };

  const addSession = async (sessionName: string, newEntry: NewSessionEntry) => {
    if (!newEntry?.vorname) {
      showNotification({
        message: 'Bitte Vorname angeben.',
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
          handynummer: newEntry.handynummer,
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
    updatedEntry: NewSessionEntry,
    originalEntry: SessionEntry,
  ) => {
    if (!id || !updatedEntry.vorname || !updatedEntry.nachname) {
      showNotification({
        message: 'Bitte Vor- und Nachnamen ausfüllen.',
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
        body: JSON.stringify({
          ...updatedEntry,
          id,
          email: updatedEntry.email || originalEntry.email,
          handynummer: updatedEntry.handynummer || originalEntry.handynummer,
        }),
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
      showNotification({
        message: `Fehler beim Aktualisieren des Eintrags: ${err}`,
        type: 'error',
        duration: 1500,
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) return <FancyLoading />;
  if (error) return null;
  if (!gameSessions) return <p>Keine sessions gefunden.</p>;

  const sortedSessions = parseSessions(gameSessions).sort(
    (a, b) =>
      new Date(`${a.date}T${a.time}`).getTime() -
      new Date(`${b.date}T${b.time}`).getTime(),
  );
  const boardgameSessions = sortedSessions.filter(
    (s) => s.type === 'boardgame',
  );
  const pnpSessions = sortedSessions.filter((s) => s.type === 'pnp');

  const groupedBoardgameSessions = groupSessionsByDay(boardgameSessions);
  const groupedPnPSessions = groupSessionsByDay(pnpSessions);
  const filteredBoardgameSessions = groupedBoardgameSessions[selectedDay] || [];
  const filteredPnPSessions = groupedPnPSessions[selectedDay] || [];

  return (
    <>
      <div className="flex w-full justify-center px-2 py-4">
        <div className="flex items-center gap-4">
          {['Freitag', 'Samstag', 'Sonntag'].map((day) => (
            <button
              key={day}
              className={`rounded-full px-4 py-2 font-bold ${selectedDay === day ? 'bg-primary text-white' : 'bg-gray-300 text-black'}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto px-6">
        {filteredBoardgameSessions.length > 0 && (
          <>
            <h2 className="mb-4 text-2xl font-bold">
              Verfügbare Brettspielsessions
            </h2>
            {filteredBoardgameSessions.map((session) => (
              <SessionTable
                key={session.id}
                session={session}
                addSession={addSession}
                deleteSession={deleteSession}
                updateSession={updateSession}
              />
            ))}
          </>
        )}
        {filteredPnPSessions.length > 0 && (
          <>
            <h2 className="mb-4 text-2xl font-bold">Verfügbare PnP Sessions</h2>
            {filteredPnPSessions.map((session) => (
              <SessionTable
                key={session.id}
                session={session}
                addSession={addSession}
                deleteSession={deleteSession}
                updateSession={updateSession}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Sessions;
